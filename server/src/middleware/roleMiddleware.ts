import { Request, Response, NextFunction } from 'express';

export type UserRole = 'HR' | 'ACCOUNTS' | 'ADMIN' | 'SITE_SUPERVISOR';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    siteId?: string;
  };
}

export type PermissionLevel = 'FULL_ACCESS' | 'READ_ONLY' | 'REQUEST_ONLY' | 'SITE_ONLY' | 'NO_ACCESS' | 'BLOCKED_MASKED';

export type SystemModule =
  | 'system_settings'
  | 'sensitive_financial_info'
  | 'payroll_processing'
  | 'audit_logs'
  | 'employee_master_data'
  | 'legal_documents'
  | 'daily_attendance'
  | 'leave_approval'
  | 'sites_departments'
  | 'manpower_management'
  | 'hr_operational_reports';

/**
 * Exact 11-Module Permission Matrix derived from project requirements & screenshot specs:
 */
const PERMISSION_MATRIX: Record<SystemModule, Record<UserRole, PermissionLevel>> = {
  system_settings: {
    HR: 'FULL_ACCESS',
    ACCOUNTS: 'FULL_ACCESS',
    ADMIN: 'NO_ACCESS',
    SITE_SUPERVISOR: 'NO_ACCESS',
  },
  sensitive_financial_info: {
    HR: 'FULL_ACCESS',
    ACCOUNTS: 'FULL_ACCESS',
    ADMIN: 'BLOCKED_MASKED',
    SITE_SUPERVISOR: 'BLOCKED_MASKED',
  },
  payroll_processing: {
    HR: 'FULL_ACCESS',
    ACCOUNTS: 'FULL_ACCESS',
    ADMIN: 'NO_ACCESS',
    SITE_SUPERVISOR: 'NO_ACCESS',
  },
  audit_logs: {
    HR: 'FULL_ACCESS',
    ACCOUNTS: 'FULL_ACCESS',
    ADMIN: 'READ_ONLY',
    SITE_SUPERVISOR: 'NO_ACCESS',
  },
  employee_master_data: {
    HR: 'FULL_ACCESS',
    ACCOUNTS: 'READ_ONLY',
    ADMIN: 'FULL_ACCESS',
    SITE_SUPERVISOR: 'SITE_ONLY',
  },
  legal_documents: {
    HR: 'FULL_ACCESS',
    ACCOUNTS: 'READ_ONLY',
    ADMIN: 'FULL_ACCESS',
    SITE_SUPERVISOR: 'SITE_ONLY',
  },
  daily_attendance: {
    HR: 'FULL_ACCESS',
    ACCOUNTS: 'READ_ONLY',
    ADMIN: 'FULL_ACCESS',
    SITE_SUPERVISOR: 'SITE_ONLY',
  },
  leave_approval: {
    HR: 'FULL_ACCESS',
    ACCOUNTS: 'NO_ACCESS',
    ADMIN: 'FULL_ACCESS',
    SITE_SUPERVISOR: 'REQUEST_ONLY',
  },
  sites_departments: {
    HR: 'FULL_ACCESS',
    ACCOUNTS: 'READ_ONLY',
    ADMIN: 'FULL_ACCESS',
    SITE_SUPERVISOR: 'READ_ONLY',
  },
  manpower_management: {
    HR: 'FULL_ACCESS',
    ACCOUNTS: 'READ_ONLY',
    ADMIN: 'FULL_ACCESS',
    SITE_SUPERVISOR: 'SITE_ONLY',
  },
  hr_operational_reports: {
    HR: 'FULL_ACCESS',
    ACCOUNTS: 'FULL_ACCESS', // Financial reports only
    ADMIN: 'FULL_ACCESS',    // Non-financial reports only
    SITE_SUPERVISOR: 'NO_ACCESS',
  },
};

export const checkModuleAccess = (
  moduleName: SystemModule,
  requiredAccess: 'read' | 'write' = 'read'
) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.role) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'User authentication required' },
      });
      return;
    }

    const role = req.user.role;
    const accessLevel = PERMISSION_MATRIX[moduleName]?.[role] || 'NO_ACCESS';

    if (accessLevel === 'NO_ACCESS' || accessLevel === 'BLOCKED_MASKED') {
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Access denied to module '${moduleName}' for role '${role}'`,
        },
      });
      return;
    }

    if (requiredAccess === 'write' && accessLevel === 'READ_ONLY') {
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Read-only access permitted for role '${role}' on module '${moduleName}'`,
        },
      });
      return;
    }

    next();
  };
};
