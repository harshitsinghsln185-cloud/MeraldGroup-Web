import React, { useEffect, useState } from 'react';
import {
  Settings as SettingsIcon,
  ShieldCheck,
  Database,
  History,
  Save,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export interface AuditLogItem {
  _id?: string;
  userEmail: string;
  userRole: string;
  action: string;
  module: string;
  details: string;
  timestamp: string;
}

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'RBAC' | 'CONFIG' | 'AUDIT'>('RBAC');
  const [saving, setSaving] = useState<boolean>(false);

  // System Settings Config state
  const [expiryThreshold, setExpiryThreshold] = useState<number>(30);
  const [autoEmail, setAutoEmail] = useState<boolean>(true);
  const [auditLogging, setAuditLogging] = useState<boolean>(true);
  const [backupSchedule, setBackupSchedule] = useState<string>('DAILY_MIDNIGHT');

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);

  const fetchSettings = React.useCallback(async () => {
    try {
      const res = await fetch('/api/v1/admin/settings', { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        if (data.settings) {
          setExpiryThreshold(data.settings.documentExpiryAlertDays || 30);
          setAutoEmail(data.settings.autoEmailAlerts ?? true);
          setAuditLogging(data.settings.auditLoggingEnabled ?? true);
          setBackupSchedule(data.settings.backupSchedule || 'DAILY_MIDNIGHT');
        }
        if (data.auditLogs) {
          setAuditLogs(data.auditLogs);
        }
      }
    } catch (err) {
      console.error('Failed to load system settings:', err);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/v1/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          documentExpiryAlertDays: expiryThreshold,
          autoEmailAlerts: autoEmail,
          auditLoggingEnabled: auditLogging,
          backupSchedule,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert('System settings updated successfully!');
        fetchSettings();
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const rbacMatrix = [
    { module: 'Employee Master Data', hr: 'FULL', accounts: 'READ', admin: 'FULL', supervisor: 'SITE_ONLY' },
    { module: 'Passport & Visa Compliance', hr: 'FULL', accounts: 'READ', admin: 'FULL', supervisor: 'SITE_ONLY' },
    { module: 'Daily Attendance & Roster', hr: 'FULL', accounts: 'READ', admin: 'FULL', supervisor: 'WRITE' },
    { module: 'Leave Approval Workflow', hr: 'FULL', accounts: 'READ', admin: 'FULL', supervisor: 'SUBMIT' },
    { module: 'Payroll & Salary (Financials)', hr: 'FULL', accounts: 'FULL', admin: 'BLOCKED (MASKED)', supervisor: 'BLOCKED (MASKED)' },
    { module: 'Manpower Supply Analytics', hr: 'FULL', accounts: 'READ', admin: 'FULL', supervisor: 'WRITE' },
    { module: 'Exit Clearance & NOC', hr: 'FULL', accounts: 'SIGN_OFF', admin: 'FULL', supervisor: 'SIGN_OFF' },
    { module: 'HR Operational Reports', hr: 'FULL', accounts: 'FINANCIAL_ONLY', admin: 'FULL', supervisor: 'SITE_ONLY' },
  ];

  return (
    <div className="space-[#0D2E45] space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-[#3D9DA0] tracking-wider uppercase">
              Phase 5 Governance
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0D2E45] mt-1 flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-[#3D9DA0]" />
            System Settings & Security Audit Logs
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Role Permission Matrix (RBAC), compliance alert parameters, database schedules & live activity trail.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('RBAC')}
          className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'RBAC'
              ? 'border-[#0D2E45] text-[#0D2E45]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Role Permission Matrix (RBAC)
        </button>

        <button
          onClick={() => setActiveTab('CONFIG')}
          className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'CONFIG'
              ? 'border-[#0D2E45] text-[#0D2E45]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Database className="w-4 h-4" />
          System Parameters & Alerts
        </button>

        <button
          onClick={() => setActiveTab('AUDIT')}
          className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'AUDIT'
              ? 'border-[#0D2E45] text-[#0D2E45]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <History className="w-4 h-4" />
          Live Audit Logs ({auditLogs.length})
        </button>
      </div>

      {/* ---------------- TAB 1: RBAC MATRIX ---------------- */}
      {activeTab === 'RBAC' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#0D2E45]">Merald Group Access Control Matrix</h3>
              <p className="text-xs text-gray-500">
                Enforced by system middleware (`checkModuleAccess`) across all backend API endpoints.
              </p>
            </div>
            <span className="text-[10px] px-3 py-1 bg-purple-50 text-purple-700 font-semibold rounded-full border border-purple-200">
              Active Role: {user?.role || 'ADMIN'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0D2E45] text-white uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="px-4 py-3">System Module</th>
                  <th className="px-4 py-3">HR Manager</th>
                  <th className="px-4 py-3">Accounts Exec</th>
                  <th className="px-4 py-3">System Admin</th>
                  <th className="px-4 py-3">Site Supervisor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rbacMatrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-teal-50/30 transition-colors">
                    <td className="px-4 py-3 font-bold text-[#0D2E45]">{row.module}</td>

                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                        {row.hr}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                        {row.accounts}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          row.admin.includes('BLOCKED')
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {row.admin}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          row.supervisor.includes('BLOCKED')
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {row.supervisor}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---------------- TAB 2: SYSTEM CONFIG ---------------- */}
      {activeTab === 'CONFIG' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-6 max-w-3xl">
          <h3 className="text-base font-bold text-[#0D2E45] border-b pb-3 flex items-center gap-2">
            <Database className="w-5 h-5 text-[#3D9DA0]" />
            Compliance & Alert Parameters
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#0D2E45] mb-1">
                Passport & Visa Expiry Warning Threshold (Days)
              </label>
              <p className="text-[11px] text-gray-500 mb-2">
                Employees with documents expiring within this timeframe will trigger 'ATTENTION' badges and automated alerts.
              </p>

              <select
                value={expiryThreshold}
                onChange={(e) => setExpiryThreshold(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:outline-hidden focus:border-[#3D9DA0]"
              >
                <option value={14}>14 Days (Urgent)</option>
                <option value={30}>30 Days (Recommended Standard)</option>
                <option value={60}>60 Days (Early Warning)</option>
              </select>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-[#0D2E45] block">Automated Email Notifications</span>
                <span className="text-[11px] text-gray-500">
                  Send automated digest emails to HR managers for expiring visas and leave approvals.
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoEmail}
                onChange={(e) => setAutoEmail(e.target.checked)}
                className="w-5 h-5 text-[#3D9DA0] rounded-sm focus:ring-[#3D9DA0]"
              />
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-[#0D2E45] block">System Audit Trail Logging</span>
                <span className="text-[11px] text-gray-500">
                  Log all payroll processing, user sign-ins, and document changes into immutable audit log.
                </span>
              </div>
              <input
                type="checkbox"
                checked={auditLogging}
                onChange={(e) => setAuditLogging(e.target.checked)}
                className="w-5 h-5 text-[#3D9DA0] rounded-sm focus:ring-[#3D9DA0]"
              />
            </div>

            <div className="pt-3 border-t border-gray-100">
              <label className="block font-bold text-[#0D2E45] mb-1">Database Backup Frequency</label>
              <select
                value={backupSchedule}
                onChange={(e) => setBackupSchedule(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:outline-hidden focus:border-[#3D9DA0]"
              >
                <option value="DAILY_MIDNIGHT">Daily Midnight (Automated Dump)</option>
                <option value="WEEKLY">Weekly Sunday Snapshot</option>
              </select>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={handleSaveConfig}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0D2E45] text-white text-xs font-semibold rounded-xl hover:bg-[#163f5c] transition-colors"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Configuration'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- TAB 3: AUDIT LOGS ---------------- */}
      {activeTab === 'AUDIT' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-sm font-bold text-[#0D2E45] flex items-center gap-2">
              <History className="w-4 h-4 text-[#3D9DA0]" />
              Immutable Security & Operational Activity Feed
            </h3>
            <span className="text-xs text-gray-500">Sorted by newest activity</span>
          </div>

          <div className="space-y-3">
            {auditLogs.map((log, idx) => (
              <div
                key={log._id || idx}
                className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#0D2E45]">{log.action}</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#0D2E45] text-white">
                      {log.userRole}
                    </span>
                    <span className="text-gray-500 font-mono text-[10px]">{log.userEmail}</span>
                  </div>
                  <p className="text-gray-600">{log.details}</p>
                </div>

                <div className="text-right shrink-0 text-[10px] text-gray-400 font-mono">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
