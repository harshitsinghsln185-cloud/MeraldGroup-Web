import { Request, Response } from 'express';
import Employee from '../models/Employee';
import Payroll from '../models/Payroll';
import Manpower from '../models/Manpower';
import AuditLog from '../models/AuditLog';

// GET /api/v1/admin/reports/summary
export const getReportsSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, country, month, currency } = req.query;

    if (type === 'PAYROLL') {
      const query: Record<string, unknown> = {};
      if (month) query.month = month;
      if (country) query.country = country;
      if (currency) {
        if (currency !== 'INR' && currency !== 'NGN') {
          res.status(400).json({ success: false, message: 'Currency strictly restricted to INR or NGN.' });
          return;
        }
        query.currency = currency;
      }

      const payrolls = await Payroll.find(query).sort({ employeeCode: 1 });
      const userRole = (req as any).user?.role;
      const canSeeFinancials = userRole === 'HR' || userRole === 'ACCOUNTS';

      const data = payrolls.map((p) => {
        const obj = p.toObject() as Record<string, any>;
        if (!canSeeFinancials) {
          delete obj.basicSalary;
          delete obj.grossSalary;
          delete obj.netSalary;
        }
        return obj;
      });

      res.json({ success: true, reportType: 'PAYROLL', data });
      return;
    }

    if (type === 'MANPOWER') {
      const query: Record<string, unknown> = {};
      if (country) query.country = country;
      const manpower = await Manpower.find(query).sort({ siteName: 1 });
      res.json({ success: true, reportType: 'MANPOWER', data: manpower });
      return;
    }

    if (type === 'AUDIT') {
      const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(100);
      res.json({ success: true, reportType: 'AUDIT', data: logs });
      return;
    }

    // Default: EMPLOYEE DIRECTORY REPORT
    const empQuery: Record<string, unknown> = {};
    if (country) empQuery.country = country;
    const employees = await Employee.find(empQuery).sort({ employeeCode: 1 });

    res.json({ success: true, reportType: 'EMPLOYEE', data: employees });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate operational report.' });
  }
};
