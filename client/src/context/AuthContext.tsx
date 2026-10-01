import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'HR' | 'ACCOUNTS' | 'ADMIN' | 'SITE_SUPERVISOR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  siteId?: string;
  avatar?: string;
}

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
  | 'hr_operational_reports'
  | 'applicant_tracking';

export type PermissionLevel = 'FULL_ACCESS' | 'READ_ONLY' | 'REQUEST_ONLY' | 'SITE_ONLY' | 'NO_ACCESS' | 'BLOCKED_MASKED';

const PERMISSION_MATRIX: Record<SystemModule, Record<UserRole, PermissionLevel>> = {
  system_settings: { HR: 'FULL_ACCESS', ACCOUNTS: 'FULL_ACCESS', ADMIN: 'NO_ACCESS', SITE_SUPERVISOR: 'NO_ACCESS' },
  sensitive_financial_info: { HR: 'FULL_ACCESS', ACCOUNTS: 'FULL_ACCESS', ADMIN: 'BLOCKED_MASKED', SITE_SUPERVISOR: 'BLOCKED_MASKED' },
  payroll_processing: { HR: 'FULL_ACCESS', ACCOUNTS: 'FULL_ACCESS', ADMIN: 'NO_ACCESS', SITE_SUPERVISOR: 'NO_ACCESS' },
  audit_logs: { HR: 'FULL_ACCESS', ACCOUNTS: 'FULL_ACCESS', ADMIN: 'READ_ONLY', SITE_SUPERVISOR: 'NO_ACCESS' },
  employee_master_data: { HR: 'FULL_ACCESS', ACCOUNTS: 'READ_ONLY', ADMIN: 'FULL_ACCESS', SITE_SUPERVISOR: 'SITE_ONLY' },
  legal_documents: { HR: 'FULL_ACCESS', ACCOUNTS: 'READ_ONLY', ADMIN: 'FULL_ACCESS', SITE_SUPERVISOR: 'SITE_ONLY' },
  daily_attendance: { HR: 'FULL_ACCESS', ACCOUNTS: 'READ_ONLY', ADMIN: 'FULL_ACCESS', SITE_SUPERVISOR: 'SITE_ONLY' },
  leave_approval: { HR: 'FULL_ACCESS', ACCOUNTS: 'NO_ACCESS', ADMIN: 'FULL_ACCESS', SITE_SUPERVISOR: 'REQUEST_ONLY' },
  sites_departments: { HR: 'FULL_ACCESS', ACCOUNTS: 'READ_ONLY', ADMIN: 'FULL_ACCESS', SITE_SUPERVISOR: 'READ_ONLY' },
  manpower_management: { HR: 'FULL_ACCESS', ACCOUNTS: 'READ_ONLY', ADMIN: 'FULL_ACCESS', SITE_SUPERVISOR: 'SITE_ONLY' },
  hr_operational_reports: { HR: 'FULL_ACCESS', ACCOUNTS: 'FULL_ACCESS', ADMIN: 'FULL_ACCESS', SITE_SUPERVISOR: 'NO_ACCESS' },
  applicant_tracking: { HR: 'FULL_ACCESS', ACCOUNTS: 'NO_ACCESS', ADMIN: 'FULL_ACCESS', SITE_SUPERVISOR: 'NO_ACCESS' },
};

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  demoLogin: (role: UserRole) => void;
  hasModuleAccess: (moduleName: SystemModule, accessType?: 'read' | 'write') => boolean;
  getModulePermission: (moduleName: SystemModule) => PermissionLevel;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('merald_token'));
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('merald_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        localStorage.removeItem('merald_user');
      }
    }
    return null;
  });
  const [isLoading] = useState<boolean>(false);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('merald_token', newToken);
    localStorage.setItem('merald_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('merald_token');
    localStorage.removeItem('merald_user');
  };

  const demoLogin = (role: UserRole) => {
    const demoUsers: Record<UserRole, User> = {
      HR: { id: 'demo-hr', name: 'Demo HR Manager', email: 'hr@meraldgroup.com', role: 'HR', department: 'Human Resources' },
      ACCOUNTS: { id: 'demo-accounts', name: 'Demo Accounts Exec', email: 'accounts@meraldgroup.com', role: 'ACCOUNTS', department: 'Finance & Accounts' },
      ADMIN: { id: 'demo-admin', name: 'Demo Administrator', email: 'admin@meraldgroup.com', role: 'ADMIN', department: 'IT & Management' },
      SITE_SUPERVISOR: { id: 'demo-supervisor', name: 'Demo Site Supervisor', email: 'supervisor@meraldgroup.com', role: 'SITE_SUPERVISOR', department: 'Lagos Site A', siteId: 'SITE-NIG-01' },
    };
    const newUser = demoUsers[role];
    const demoToken = `demo_token_${role.toLowerCase()}_2026`;
    login(demoToken, newUser);
  };

  const getModulePermission = (moduleName: SystemModule): PermissionLevel => {
    if (!user) return 'NO_ACCESS';
    return PERMISSION_MATRIX[moduleName]?.[user.role] || 'NO_ACCESS';
  };

  const hasModuleAccess = (
    moduleName: SystemModule,
    accessType: 'read' | 'write' = 'read'
  ): boolean => {
    if (!user) return false;
    const level = getModulePermission(moduleName);

    if (level === 'NO_ACCESS' || level === 'BLOCKED_MASKED') return false;
    if (accessType === 'write' && level === 'READ_ONLY') return false;
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        logout,
        demoLogin,
        hasModuleAccess,
        getModulePermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// oxlint-disable-next-line react/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
