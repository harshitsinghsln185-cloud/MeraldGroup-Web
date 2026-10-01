import { Request, Response } from 'express';
import Leave from '../models/Leave';

// GET /api/v1/admin/leave (List leave applications)
export const getLeaves = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, employeeId } = req.query;
    const query: Record<string, unknown> = {};

    if (status) query.status = status;
    if (employeeId) query.employeeId = employeeId;

    const leaves = await Leave.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: leaves,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch leave requests.' });
  }
};

// POST /api/v1/admin/leave (Apply for Leave)
export const applyLeave = async (req: Request, res: Response): Promise<void> => {
  try {
    const leave = new Leave(req.body);
    await leave.save();

    res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully.',
      data: leave,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error submitting leave request.' });
  }
};

// PUT /api/v1/admin/leave/:id/status (Approve or Reject Leave)
export const updateLeaveStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;
    const userRole = (req as any).user?.role;

    if (userRole !== 'HR' && userRole !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Only HR Managers and Admins can approve/reject leave requests.' });
      return;
    }

    const approvedBy = (req as any).user?.email || 'HR Manager';
    const updated = await Leave.findByIdAndUpdate(
      id,
      { status, approvedBy, rejectionReason },
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ success: false, message: 'Leave request not found.' });
      return;
    }

    res.json({
      success: true,
      message: `Leave request ${status.toLowerCase()} successfully.`,
      data: updated,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error updating leave status.' });
  }
};
