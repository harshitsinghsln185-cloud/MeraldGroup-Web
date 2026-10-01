import { Request, Response } from 'express';
import AuditLog from '../models/AuditLog';

// Memory config store for system settings
let systemSettings = {
  documentExpiryAlertDays: 30,
  autoEmailAlerts: true,
  auditLoggingEnabled: true,
  defaultCurrency: 'NGN',
  backupSchedule: 'DAILY_MIDNIGHT',
  allowedCurrencies: ['INR', 'NGN'],
  lastBackupDate: new Date(),
  companyDetails: {
    legalName: 'Merald Group Enterprise Global',
    headquarters: 'Victoria Island, Lagos, Nigeria & Gurgaon, Haryana, India',
    registrationNumber: 'MGD-RC-98127394',
    contactEmail: 'contact@meraldgroup.com',
  },
};

// GET /api/v1/admin/settings
export const getSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(25);

    // If empty audit logs, populate seed logs
    if (logs.length === 0) {
      const demoLogs = [
        {
          userEmail: 'hr@meraldgroup.com',
          userRole: 'HR',
          action: 'PAYROLL_BATCH_PROCESSED',
          module: 'payroll_processing',
          details: 'Processed 2026-09 batch monthly payroll for 48 active employees.',
          timestamp: new Date(Date.now() - 3600000 * 2),
        },
        {
          userEmail: 'accounts@meraldgroup.com',
          userRole: 'ACCOUNTS',
          action: 'PAYSLIP_PRINTED',
          module: 'payroll_processing',
          details: 'Generated official Merald Group Payslip PDF for MGD-NIG-1001.',
          timestamp: new Date(Date.now() - 3600000 * 5),
        },
        {
          userEmail: 'supervisor@meraldgroup.com',
          userRole: 'SITE_SUPERVISOR',
          action: 'MANPOWER_UPDATED',
          module: 'manpower_management',
          details: 'Updated Lagos Commercial Tower site deployment headcount.',
          timestamp: new Date(Date.now() - 3600000 * 12),
        },
      ];
      await AuditLog.insertMany(demoLogs);
      const reFetchedLogs = await AuditLog.find().sort({ timestamp: -1 }).limit(25);

      res.json({
        success: true,
        settings: systemSettings,
        auditLogs: reFetchedLogs,
      });
      return;
    }

    res.json({
      success: true,
      settings: systemSettings,
      auditLogs: logs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch system settings.' });
  }
};

// PUT /api/v1/admin/settings
export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { documentExpiryAlertDays, autoEmailAlerts, auditLoggingEnabled, backupSchedule } = req.body;

    systemSettings = {
      ...systemSettings,
      documentExpiryAlertDays: documentExpiryAlertDays ?? systemSettings.documentExpiryAlertDays,
      autoEmailAlerts: autoEmailAlerts ?? systemSettings.autoEmailAlerts,
      auditLoggingEnabled: auditLoggingEnabled ?? systemSettings.auditLoggingEnabled,
      backupSchedule: backupSchedule ?? systemSettings.backupSchedule,
    };

    // Log the configuration change
    const userEmail = (req as any).user?.email || 'System Admin';
    const userRole = (req as any).user?.role || 'ADMIN';

    await AuditLog.create({
      userEmail,
      userRole,
      action: 'SYSTEM_SETTINGS_UPDATED',
      module: 'system_settings',
      details: `Updated document expiry threshold to ${systemSettings.documentExpiryAlertDays} days and auto alerts to ${systemSettings.autoEmailAlerts}.`,
    });

    res.json({
      success: true,
      message: 'System configuration updated successfully.',
      settings: systemSettings,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error updating system settings.' });
  }
};
