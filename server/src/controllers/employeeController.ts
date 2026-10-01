import { Request, Response } from 'express';
import Employee from '../models/Employee';

// GET /api/v1/admin/employees (List with RBAC financial masking & pagination)
export const getEmployees = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const country = req.query.country as string;
    const department = req.query.department as string;
    const site = req.query.site as string;
    const search = req.query.search as string;

    const query: Record<string, unknown> = {};

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

    const total = await Employee.countDocuments(query);
    const employees = await Employee.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // RBAC Enforcer: Mask financial fields for roles without 'sensitive_financial_info' FULL_ACCESS (HR and ACCOUNTS only)
    const userRole = (req as any).user?.role;
    const canSeeFinancials = userRole === 'HR' || userRole === 'ACCOUNTS';

    const processedEmployees = employees.map((emp) => {
      const obj = emp.toObject();
      if (!canSeeFinancials) {
        delete obj.basicSalary;
        delete obj.bankName;
        delete obj.accountNumber;
        delete obj.taxPin;
      }
      return obj;
    });

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
    const userRole = (req as any).user?.role;
    if (userRole !== 'HR' && userRole !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Insufficient permission to provision employee master record.' });
      return;
    }

    const employee = new Employee(req.body);
    await employee.save();

    res.status(201).json({
      success: true,
      message: 'Employee record created successfully.',
      data: employee,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error creating employee record.' });
  }
};

// PUT /api/v1/admin/employees/:id (Update Employee)
export const updateEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await Employee.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ success: false, message: 'Employee not found.' });
      return;
    }

    res.json({
      success: true,
      message: 'Employee updated successfully.',
      data: updated,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error updating employee record.' });
  }
};

// DELETE /api/v1/admin/employees/:id (Delete Employee)
export const deleteEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Employee.findByIdAndDelete(id);
    res.json({ success: true, message: 'Employee record deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting employee.' });
  }
};
