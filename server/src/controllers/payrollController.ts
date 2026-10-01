import { Request, Response } from 'express';
import Payroll from '../models/Payroll';

/**
 * Safe Financial Calculator: Uses integer minor units (kobo/paise * 100)
 * to avoid JS floating-point arithmetic precision errors (0.1 + 0.2 bugs).
 */
export const calculatePayrollDetails = (
  basic: number,
  housing = 0,
  transport = 0,
  otherAllowances = 0,
  taxRate = 0.10,
  pensionRate = 0.05
) => {
  const basicCents = Math.round(basic * 100);
  const housingCents = Math.round(housing * 100);
  const transportCents = Math.round(transport * 100);
  const otherCents = Math.round(otherAllowances * 100);

  const grossCents = basicCents + housingCents + transportCents + otherCents;
  const taxCents = Math.round(grossCents * taxRate);
  const pensionCents = Math.round(basicCents * pensionRate);
  const totalDeductionsCents = taxCents + pensionCents;
  const netCents = Math.max(0, grossCents - totalDeductionsCents);

  return {
    basicSalary: basicCents / 100,
    housingAllowance: housingCents / 100,
    transportAllowance: transportCents / 100,
    otherAllowances: otherCents / 100,
    grossSalary: grossCents / 100,
    taxDeduction: taxCents / 100,
    pensionDeduction: pensionCents / 100,
    totalDeductions: totalDeductionsCents / 100,
    netSalary: netCents / 100,
  };
};

// GET /api/v1/admin/payroll (List payrolls with RBAC masking, pagination & currency restriction)
export const getPayrolls = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const month = (req.query.month as string) || '2026-09';
    const currencyFilter = req.query.currency as string;
    const userRole = (req as any).user?.role;

    const query: Record<string, unknown> = { month };
    if (currencyFilter) {
      if (currencyFilter !== 'INR' && currencyFilter !== 'NGN') {
        res.status(400).json({ success: false, message: 'Currency support is strictly restricted to INR or NGN.' });
        return;
      }
      query.currency = currencyFilter;
    }

    const total = await Payroll.countDocuments(query);
    const payrolls = await Payroll.find(query)
      .sort({ employeeCode: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // RBAC Masking check: Only HR and ACCOUNTS roles can see financial numbers
    const canSeeFinancials = userRole === 'HR' || userRole === 'ACCOUNTS';

    const processed = payrolls.map((item) => {
      const obj = item.toObject() as Record<string, any>;
      if (!canSeeFinancials) {
        // Mask financial figures
        delete obj.basicSalary;
        delete obj.housingAllowance;
        delete obj.transportAllowance;
        delete obj.otherAllowances;
        delete obj.grossSalary;
        delete obj.taxDeduction;
        delete obj.pensionDeduction;
        delete obj.otherDeductions;
        delete obj.totalDeductions;
        delete obj.netSalary;
      }
      return obj;
    });

    res.json({
      success: true,
      data: processed,
      canSeeFinancials,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch payroll records.' });
  }
};

// POST /api/v1/admin/payroll/process (Process Batch Monthly Payroll)
export const processPayrollBatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const userRole = (req as any).user?.role;
    if (userRole !== 'HR' && userRole !== 'ACCOUNTS') {
      res.status(403).json({
        success: false,
        message: 'Payroll processing requires HR or ACCOUNTS user authorization per RBAC matrix.',
      });
      return;
    }

    const { month } = req.body;
    const processedBy = (req as any).user?.email || 'HR/Accounts';

    // Bulk update status to PROCESSED
    await Payroll.updateMany({ month }, { paymentStatus: 'PROCESSED', processedBy, paymentDate: new Date() });

    res.json({
      success: true,
      message: `Payroll for month ${month} processed successfully.`,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error processing payroll.' });
  }
};

// PUT /api/v1/admin/payroll/:id/status (Update single record status)
export const updatePayrollStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;
    const userRole = (req as any).user?.role;

    if (userRole !== 'HR' && userRole !== 'ACCOUNTS') {
      res.status(403).json({ success: false, message: 'Payment status update requires HR or ACCOUNTS role.' });
      return;
    }

    const updated = await Payroll.findByIdAndUpdate(
      id,
      { paymentStatus, paymentDate: new Date() },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Payment status updated.',
      data: updated,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error updating status.' });
  }
};
