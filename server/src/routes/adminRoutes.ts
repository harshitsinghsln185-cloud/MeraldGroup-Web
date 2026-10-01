import { Router } from 'express';
import { getDashboardMetrics } from '../controllers/dashboardController';
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employeeController';
import { getAttendance, recordAttendance } from '../controllers/attendanceController';
import { getLeaves, applyLeave, updateLeaveStatus } from '../controllers/leaveController';
import { getPayrolls, processPayrollBatch, updatePayrollStatus } from '../controllers/payrollController';
import { getManpowerAnalytics } from '../controllers/manpowerController';
import { getClearances, createClearance, updateClearanceItem } from '../controllers/clearanceController';
import { getReportsSummary } from '../controllers/reportsController';
import { getSettings, updateSettings } from '../controllers/settingsController';
import {
  getUsers,
  getPendingUsers,
  approveUser,
  rejectUser,
  updateUserRole,
  deleteUser,
} from '../controllers/userController';

import { verifyToken } from '../middleware/authMiddleware';
import { checkModuleAccess } from '../middleware/roleMiddleware';

const router = Router();

// Protect all admin routes with JWT verification
router.use(verifyToken);

// Dashboard
router.get('/dashboard/metrics', getDashboardMetrics);

// User Management & HR Pending Approvals
router.get('/users', checkModuleAccess('system_settings', 'read'), getUsers);
router.get('/users/pending', checkModuleAccess('system_settings', 'read'), getPendingUsers);
router.put('/users/:id/approve', checkModuleAccess('system_settings', 'write'), approveUser);
router.put('/users/:id/reject', checkModuleAccess('system_settings', 'write'), rejectUser);
router.put('/users/:id/role', checkModuleAccess('system_settings', 'write'), updateUserRole);
router.delete('/users/:id', checkModuleAccess('system_settings', 'write'), deleteUser);

// Employee Master Data
router.get('/employees', checkModuleAccess('employee_master_data', 'read'), getEmployees);
router.post('/employees', checkModuleAccess('employee_master_data', 'write'), createEmployee);
router.put('/employees/:id', checkModuleAccess('employee_master_data', 'write'), updateEmployee);
router.delete('/employees/:id', checkModuleAccess('employee_master_data', 'write'), deleteEmployee);

// Attendance Roster & Check-ins
router.get('/attendance', checkModuleAccess('daily_attendance', 'read'), getAttendance);
router.post('/attendance', checkModuleAccess('daily_attendance', 'write'), recordAttendance);

// Leave Approval Workflows
router.get('/leave', checkModuleAccess('leave_approval', 'read'), getLeaves);
router.post('/leave', checkModuleAccess('leave_approval', 'write'), applyLeave);
router.put('/leave/:id/status', checkModuleAccess('leave_approval', 'write'), updateLeaveStatus);

// Payroll Processing & Compensation (Strictly INR & NGN)
router.get('/payroll', checkModuleAccess('payroll_processing', 'read'), getPayrolls);
router.post('/payroll/process', checkModuleAccess('payroll_processing', 'write'), processPayrollBatch);
router.put('/payroll/:id/status', checkModuleAccess('payroll_processing', 'write'), updatePayrollStatus);

// Manpower Supply Analytics
router.get('/manpower', checkModuleAccess('manpower_management', 'read'), getManpowerAnalytics);

// Phase 5: Offboarding & Exit Clearance Management
router.get('/clearance', checkModuleAccess('employee_master_data', 'read'), getClearances);
router.post('/clearance', checkModuleAccess('employee_master_data', 'write'), createClearance);
router.put('/clearance/:id/item', checkModuleAccess('employee_master_data', 'write'), updateClearanceItem);

// Phase 5: Filterable Reports & Data Export Suite
router.get('/reports/summary', checkModuleAccess('hr_operational_reports', 'read'), getReportsSummary);

// Phase 5: System Settings & Audit Logs
router.get('/settings', checkModuleAccess('system_settings', 'read'), getSettings);
router.put('/settings', checkModuleAccess('system_settings', 'write'), updateSettings);

export default router;
