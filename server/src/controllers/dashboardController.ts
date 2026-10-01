import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/roleMiddleware';
import Employee from '../models/Employee';
import Leave from '../models/Leave';
import AuditLog from '../models/AuditLog';
import Manpower from '../models/Manpower';
import Attendance from '../models/Attendance';

export const getDashboardMetrics = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const role = req.user?.role || 'ADMIN';
    const siteId = req.user?.siteId;

    const empQuery: Record<string, unknown> = { status: 'ACTIVE' };
    if (role === 'SITE_SUPERVISOR' && siteId) {
      empQuery.siteLocation = siteId;
    }

    const totalEmployees = await Employee.countDocuments(empQuery);
    const uniqueSites = await Employee.distinct('siteLocation', empQuery);
    const activeSites = uniqueSites.filter(Boolean).length;

    const pendingLeaveRequests = await Leave.countDocuments({ status: 'PENDING' });

    // Calculate manpower shortfall
    const mpAgg = await Manpower.aggregate([
      { $group: { _id: null, totalShortfall: { $sum: '$shortfall' } } },
    ]);
    const manpowerShortfall = mpAgg[0]?.totalShortfall || 0;

    // Document expiry alerts (within 30 days)
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const employeesWithExpiringDocs = await Employee.find({
      'documents.expiryDate': { $lte: thirtyDaysFromNow },
    }).limit(10);

    const documentExpiryAlerts: Array<{
      id: string;
      employeeName: string;
      employeeCode: string;
      documentType: string;
      expiryDate: string;
      daysRemaining: number;
      site: string;
    }> = [];

    for (const emp of employeesWithExpiringDocs) {
      for (const doc of emp.documents || []) {
        if (doc.expiryDate && new Date(doc.expiryDate) <= thirtyDaysFromNow) {
          const diffMs = new Date(doc.expiryDate).getTime() - Date.now();
          const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
          documentExpiryAlerts.push({
            id: String((doc as any)._id || `${emp._id}-${doc.documentType}`),
            employeeName: emp.fullName,
            employeeCode: emp.employeeCode,
            documentType: doc.documentType,
            expiryDate: new Date(doc.expiryDate).toISOString().split('T')[0],
            daysRemaining,
            site: emp.siteLocation || 'Unassigned',
          });
        }
      }
    }

    // Today's attendance percentage
    const todayStr = new Date().toISOString().split('T')[0];
    const todayPresentCount = await Attendance.countDocuments({ date: todayStr, status: 'P' });
    const todayAttendancePercentage = totalEmployees > 0
      ? Math.round((todayPresentCount / totalEmployees) * 1000) / 10
      : 0;

    // Headcount by country
    const countryAgg = await Employee.aggregate([
      { $match: { status: 'ACTIVE' } },
      { $group: { _id: '$country', headcount: { $sum: 1 }, sites: { $addToSet: '$siteLocation' } } },
    ]);

    const headcountByCountry = countryAgg.map((c) => ({
      country: c._id || 'General',
      headcount: c.headcount,
      sites: c.sites.filter(Boolean).length,
    }));

    // Recent activities from audit log
    const recentLogs = await AuditLog.find().sort({ timestamp: -1 }).limit(5);
    const recentActivities = recentLogs.map((log) => ({
      id: String(log._id),
      timestamp: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: log.module.toUpperCase(),
      description: `${log.action}: ${log.details}`,
    }));

    const metrics = {
      totalEmployees,
      activeSites,
      documentExpiryCount: documentExpiryAlerts.length,
      todayAttendancePercentage,
      pendingLeaveRequests,
      manpowerShortfall,
      roleAccess: {
        role,
        canAccessFinancials: role === 'HR' || role === 'ACCOUNTS',
        canAccessSettings: role === 'HR' || role === 'ACCOUNTS',
        canApproveLeaves: role === 'HR' || role === 'ADMIN',
      },
      documentExpiryAlerts,
      recentActivities,
      headcountByCountry,
    };

    res.status(200).json({
      success: true,
      data: metrics,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message || 'Error fetching metrics' },
    });
  }
};
