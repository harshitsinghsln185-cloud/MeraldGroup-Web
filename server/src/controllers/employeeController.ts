import { Request, Response } from 'express';
import Employee from '../models/Employee';
import { UserRole } from '../middleware/roleMiddleware';

/**
 * Server-side Sanitizer: Strips sensitive financial fields (basicSalary, bankName, accountNumber, taxPin)
 * for roles that do NOT have FULL_ACCESS to 'sensitive_financial_info' (only HR and ACCOUNTS can see them).
 * ADMIN and SITE_SUPERVISOR have these fields stripped entirely from API responses.
 */
export const sanitizeEmployeeForRole = (employee: any, role?: UserRole): any => {
  const canSeeFinancials = role === 'HR' || role === 'ACCOUNTS';
  const obj = typeof employee?.toObject === 'function' ? employee.toObject() : { ...employee };
  if (!canSeeFinancials) {
    delete obj.basicSalary;
    delete obj.bankName;
    delete obj.accountNumber;
    delete obj.taxPin;
  }
  return obj;
};

// GET /api/v1/admin/employees (List with RBAC financial masking & pagination)
export const getEmployees = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const country = req.query.country as string;
    const department = req.query.department as string;
    const site = req.query.site as string;
    const search = req.query.search as string;
    const includeInactive = req.query.includeInactive === 'true';

    const query: Record<string, unknown> = {};
    if (!includeInactive) {
      query.status = { $ne: 'INACTIVE' };
    }

    if (country) query.country = country;
    if (department) query.department = department;
    if (site) query.siteLocation = site;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { employeeCode: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } },
      ];
    }

    const userRole = (req as any).user?.role as UserRole | undefined;

    const total = await Employee.countDocuments(query);
    const employees = await Employee.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const processedEmployees = employees.map((emp) => sanitizeEmployeeForRole(emp, userRole));

    res.json({
      success: true,
      data: processedEmployees,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch employees list' });
  }
};

// POST /api/v1/admin/employees (Create Employee)
export const createEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const userRole = (req as any).user?.role as UserRole | undefined;
    if (userRole !== 'HR' && userRole !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Insufficient permission to provision employee master record.' });
      return;
    }

    const employee = new Employee(req.body);
    await employee.save();

    res.status(201).json({
      success: true,
      message: 'Employee record created successfully.',
      data: sanitizeEmployeeForRole(employee, userRole),
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error creating employee record.' });
  }
};

// PUT /api/v1/admin/employees/:id (Update Employee)
export const updateEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const userRole = (req as any).user?.role as UserRole | undefined;
    const { id } = req.params;
    const updated = await Employee.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ success: false, message: 'Employee not found.' });
      return;
    }

    res.json({
      success: true,
      message: 'Employee updated successfully.',
      data: sanitizeEmployeeForRole(updated, userRole),
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error updating employee record.' });
  }
};

// DELETE /api/v1/admin/employees/:id (Soft Delete Employee: set status to INACTIVE)
export const deleteEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await Employee.findByIdAndUpdate(id, { status: 'INACTIVE' }, { new: true });
    if (!updated) {
      res.status(404).json({ success: false, message: 'Employee not found.' });
      return;
    }
    res.json({ success: true, message: 'Employee record marked as INACTIVE (soft deleted).' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error soft deleting employee.' });
  }
};
