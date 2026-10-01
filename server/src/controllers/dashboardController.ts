import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/roleMiddleware';

export const getDashboardMetrics = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const role = req.user?.role || 'ADMIN';
    const siteId = req.user?.siteId;

    // Rich initial mock/computed operational data for Phase 2 Dashboard
    const metrics = {
      totalEmployees: 485,
      activeSites: 18,
      documentExpiryCount: 14,
      todayAttendancePercentage: 94.2,
      pendingLeaveRequests: 8,
      manpowerShortfall: role === 'SITE_SUPERVISOR' && siteId ? 5 : 24,
      roleAccess: {
        role,
        canAccessFinancials: role === 'HR' || role === 'ACCOUNTS',
        canAccessSettings: role === 'HR' || role === 'ACCOUNTS',
        canApproveLeaves: role === 'HR' || role === 'ADMIN',
      },
      documentExpiryAlerts: [
        {
          id: 'EXP-101',
          employeeName: 'Emmanuel Chukwu',
          employeeCode: 'MRLD-NIG-042',
          documentType: 'Work Permit',
          expiryDate: '2026-10-12',
          daysRemaining: 17,
          site: 'Lagos Island Site A',
        },
        {
          id: 'EXP-102',
          employeeName: 'Rajesh Kumar',
          employeeCode: 'MRLD-IND-118',
          documentType: 'Passport',
          expiryDate: '2026-10-19',
          daysRemaining: 24,
          site: 'Noida Metro Hub',
        },
        {
          id: 'EXP-103',
          employeeName: 'Zaid Al-Hassan',
          employeeCode: 'MRLD-UAE-089',
          documentType: 'Emirates ID',
          expiryDate: '2026-10-05',
          daysRemaining: 10,
          site: 'Dubai Business Bay Tower',
        },
        {
          id: 'EXP-104',
          employeeName: 'Kwame Mensah',
          employeeCode: 'MRLD-GHA-055',
          documentType: 'HSE Certification',
          expiryDate: '2026-10-28',
          daysRemaining: 33,
          site: 'Accra Power Substation',
        },
      ],
      recentActivities: [
        {
          id: 'ACT-01',
          timestamp: '10 mins ago',
          type: 'ATTENDANCE',
          description: 'Lagos Island Site A attendance roster submitted by Site Supervisor',
        },
        {
          id: 'ACT-02',
          timestamp: '45 mins ago',
          type: 'LEAVE',
          description: 'Annual Leave request submitted by Rajesh Kumar (Noida Metro)',
        },
        {
          id: 'ACT-03',
          timestamp: '2 hours ago',
          type: 'ONBOARDING',
          description: 'New employee onboarding credentials generated for 3 MEP Technicians',
        },
        {
          id: 'ACT-04',
          timestamp: '4 hours ago',
          type: 'DOCUMENT',
          description: 'Renewed Work Permit uploaded for Emmanuel Chukwu',
        },
      ],
      headcountByCountry: [
        { country: 'Nigeria', headcount: 195, sites: 7 },
        { country: 'India', headcount: 140, sites: 5 },
        { country: 'UAE', headcount: 82, sites: 3 },
        { country: 'Ghana', headcount: 43, sites: 2 },
        { country: 'Uganda', headcount: 25, sites: 1 },
      ],
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
