import { Request, Response } from 'express';
import Clearance from '../models/Clearance';
import Employee from '../models/Employee';

// GET /api/v1/admin/clearance (List all offboarding clearance requests)
export const getClearances = async (req: Request, res: Response): Promise<void> => {
  try {
    const { country, status } = req.query;
    const query: Record<string, unknown> = {};

    if (country) query.country = country;
    if (status) query.status = status;

    const items = await Clearance.find(query).sort({ createdAt: -1 });

    // Fallback seed demo entries if empty
    if (items.length === 0) {
      const demoEntries = [
        {
          employeeCode: 'MGD-NIG-1001',
          employeeName: 'Chidi Okonkwo',
          country: 'Nigeria',
          department: 'MEP Services',
          designation: 'Senior MEP Project Engineer',
          exitReason: 'Contract Completion / Relocation',
          lastWorkingDay: new Date('2026-10-15'),
          status: 'CLEARED',
          nocIssued: true,
          nocIssuedDate: new Date('2026-09-20'),
          nocReferenceNo: 'MGD/NOC/2026/0942',
          clearanceItems: [
            { departmentKey: 'IT', departmentName: 'IT Hardware & Email Access', cleared: true, clearedBy: 'itadmin@meraldgroup.com', clearedAt: new Date() },
            { departmentKey: 'HR', departmentName: 'ID Badge & Employment Contract', cleared: true, clearedBy: 'hr@meraldgroup.com', clearedAt: new Date() },
            { departmentKey: 'ACCOUNTS', departmentName: 'Financial Dues & Gratuity', cleared: true, clearedBy: 'accounts@meraldgroup.com', clearedAt: new Date() },
            { departmentKey: 'SITE', departmentName: 'Safety Gear & Site Tooling', cleared: true, clearedBy: 'supervisor@meraldgroup.com', clearedAt: new Date() },
          ],
        },
        {
          employeeCode: 'MGD-IND-2004',
          employeeName: 'Rajesh Sharma',
          country: 'India',
          department: 'HVAC',
          designation: 'HVAC Specialist Technician',
          exitReason: 'Personal Career Transition',
          lastWorkingDay: new Date('2026-10-30'),
          status: 'IN_PROGRESS',
          nocIssued: false,
          clearanceItems: [
            { departmentKey: 'IT', departmentName: 'IT Hardware & Email Access', cleared: true, clearedBy: 'itadmin@meraldgroup.com', clearedAt: new Date() },
            { departmentKey: 'HR', departmentName: 'ID Badge & Employment Contract', cleared: true, clearedBy: 'hr@meraldgroup.com', clearedAt: new Date() },
            { departmentKey: 'ACCOUNTS', departmentName: 'Financial Dues & Gratuity', cleared: false },
            { departmentKey: 'SITE', departmentName: 'Safety Gear & Site Tooling', cleared: true, clearedBy: 'supervisor@meraldgroup.com', clearedAt: new Date() },
          ],
        },
      ];

      await Clearance.insertMany(demoEntries);
      const reFetched = await Clearance.find(query).sort({ createdAt: -1 });
      res.json({ success: true, data: reFetched });
      return;
    }

    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch exit clearances.' });
  }
};

// POST /api/v1/admin/clearance (Create new exit clearance request)
export const createClearance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { employeeCode, exitReason, lastWorkingDay } = req.body;

    const employee = await Employee.findOne({ employeeCode });
    if (!employee) {
      res.status(404).json({ success: false, message: 'Employee code not found.' });
      return;
    }

    const newClearance = await Clearance.create({
      employeeCode: employee.employeeCode,
      employeeName: employee.fullName,
      country: employee.country,
      department: employee.department,
      designation: employee.designation,
      exitReason,
      lastWorkingDay: new Date(lastWorkingDay),
      status: 'IN_PROGRESS',
      nocIssued: false,
      clearanceItems: [
        { departmentKey: 'IT', departmentName: 'IT Hardware & Email Access', cleared: false },
        { departmentKey: 'HR', departmentName: 'ID Badge & Employment Contract', cleared: false },
        { departmentKey: 'ACCOUNTS', departmentName: 'Financial Dues & Gratuity', cleared: false },
        { departmentKey: 'SITE', departmentName: 'Safety Gear & Site Tooling', cleared: false },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Exit clearance request initiated.',
      data: newClearance,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error creating clearance.' });
  }
};

// PUT /api/v1/admin/clearance/:id/item (Update department clearance item status)
export const updateClearanceItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { departmentKey, cleared, remarks } = req.body;
    const userEmail = (req as any).user?.email || 'HR Manager';

    const clearance = await Clearance.findById(id);
    if (!clearance) {
      res.status(404).json({ success: false, message: 'Clearance record not found.' });
      return;
    }

    const item = clearance.clearanceItems.find((ci) => ci.departmentKey === departmentKey);
    if (item) {
      item.cleared = cleared;
      item.remarks = remarks || '';
      item.clearedBy = userEmail;
      item.clearedAt = new Date();
    }

    // Check if all 4 department items are cleared
    const allCleared = clearance.clearanceItems.every((ci) => ci.cleared);
    if (allCleared) {
      clearance.status = 'CLEARED';
      clearance.nocIssued = true;
      clearance.nocIssuedDate = new Date();
      clearance.nocReferenceNo = `MGD/NOC/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;
    }

    await clearance.save();

    res.json({
      success: true,
      message: 'Clearance item updated successfully.',
      data: clearance,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error updating clearance item.' });
  }
};
