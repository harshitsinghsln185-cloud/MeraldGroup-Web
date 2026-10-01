import { Request, Response } from 'express';
import Attendance from '../models/Attendance';
import Employee from '../models/Employee';

// GET /api/v1/admin/attendance (List attendance by date/month & site)
export const getAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date, month, site } = req.query;
    const query: Record<string, unknown> = {};

    if (date) query.date = date;
    else if (month) query.date = { $regex: `^${month}` }; // e.g. "2026-09"
    if (site) query.siteLocation = site;

    const attendanceRecords = await Attendance.find(query).sort({ date: -1, employeeCode: 1 });

    res.json({
      success: true,
      data: attendanceRecords,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch attendance records.' });
  }
};

// POST /api/v1/admin/attendance (Record daily check-in or bulk attendance roster)
export const recordAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { employeeId, employeeCode, employeeName, date, status, overtimeHours, siteLocation } = req.body;
    const recordedBy = (req as any).user?.email || 'System';

    // Upsert single attendance entry
    const record = await Attendance.findOneAndUpdate(
      { employeeId, date },
      {
        employeeId,
        employeeCode,
        employeeName,
        date,
        status,
        overtimeHours: overtimeHours || 0,
        siteLocation,
        recordedBy,
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: 'Attendance recorded successfully.',
      data: record,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error recording attendance.' });
  }
};
