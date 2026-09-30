import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import {
  Users,
  Building2,
  AlertTriangle,
  CalendarCheck,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Plus,
  Shield,
  Eye,
  EyeOff,
  UserCheck,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardMetrics {
  totalEmployees: number;
  activeSites: number;
  documentExpiryCount: number;
  todayAttendancePercentage: number;
  pendingLeaveRequests: number;
  manpowerShortfall: number;
  documentExpiryAlerts: Array<{
    id: string;
    employeeName: string;
    employeeCode: string;
    documentType: string;
    expiryDate: string;
    daysRemaining: number;
    site: string;
  }>;
  recentActivities: Array<{
    id: string;
    timestamp: string;
    type: string;
    description: string;
  }>;
  headcountByCountry: Array<{
    country: string;
    headcount: number;
    sites: number;
  }>;
}

export const AdminDashboard: React.FC = () => {
  const { user, getModulePermission } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // RBAC Permission checks for UI components
  const canSeeFinancials = getModulePermission('sensitive_financial_info') === 'FULL_ACCESS';
  const canSeeAuditLogs = getModulePermission('audit_logs') !== 'NO_ACCESS';

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const token = localStorage.getItem('merald_token');
        const res = await fetch('/api/v1/admin/dashboard/metrics', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setMetrics(data.data);
        } else {
          // Fallback mock metrics
          applyFallbackMetrics();
        }
      } catch {
        applyFallbackMetrics();
      } finally {
        setLoading(false);
      }
    };

    const applyFallbackMetrics = () => {
      setMetrics({
        totalEmployees: 485,
        activeSites: 18,
        documentExpiryCount: 14,
        todayAttendancePercentage: 94.2,
        pendingLeaveRequests: 8,
        manpowerShortfall: user?.role === 'SITE_SUPERVISOR' ? 5 : 24,
        documentExpiryAlerts: [
          {
            id: 'EXP-101',
            employeeName: 'Emmanuel Chukwu',
            employeeCode: 'MRLD-NIG-042',
            documentType: 'Work Permit',
            expiryDate: '2026-10-12',
            daysRemaining: 17,
            site: 'Lagos Island Site A',
          },
          {
            id: 'EXP-102',
            employeeName: 'Rajesh Kumar',
            employeeCode: 'MRLD-IND-118',
            documentType: 'Passport',
            expiryDate: '2026-10-19',
            daysRemaining: 24,
            site: 'Noida Metro Hub',
          },
          {
            id: 'EXP-103',
            employeeName: 'Zaid Al-Hassan',
            employeeCode: 'MRLD-UAE-089',
            documentType: 'Emirates ID',
            expiryDate: '2026-10-05',
            daysRemaining: 10,
            site: 'Dubai Business Bay Tower',
          },
          {
            id: 'EXP-104',
            employeeName: 'Kwame Mensah',
            employeeCode: 'MRLD-GHA-055',
            documentType: 'HSE Certification',
            expiryDate: '2026-10-28',
            daysRemaining: 33,
            site: 'Accra Power Substation',
          },
        ],
        recentActivities: [
          {
            id: 'ACT-01',
            timestamp: '10 mins ago',
            type: 'ATTENDANCE',
            description: 'Lagos Island Site A roster submitted by Site Supervisor',
          },
          {
            id: 'ACT-02',
            timestamp: '45 mins ago',
            type: 'LEAVE',
            description: 'Annual Leave request submitted by Rajesh Kumar (Noida Metro)',
          },
          {
            id: 'ACT-03',
            timestamp: '2 hours ago',
            type: 'ONBOARDING',
            description: 'New employee onboarding credentials generated for 3 MEP Technicians',
          },
          {
            id: 'ACT-04',
            timestamp: '4 hours ago',
            type: 'DOCUMENT',
            description: 'Renewed Work Permit uploaded for Emmanuel Chukwu',
          },
        ],
        headcountByCountry: [
          { country: 'Nigeria', headcount: 195, sites: 7 },
          { country: 'India', headcount: 140, sites: 5 },
          { country: 'UAE', headcount: 82, sites: 3 },
          { country: 'Ghana', headcount: 43, sites: 2 },
          { country: 'Uganda', headcount: 25, sites: 1 },
        ],
      });
    };

    fetchMetrics();
  }, [user]);

  if (loading || !metrics) {
    return (
      <div className="py-24 text-center">
        <div className="w-12 h-12 border-4 border-[#3D9DA0] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-medium text-[#0D2E45]">Loading Executive Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-r from-[#0D2E45] via-[#14476B] to-[#1D6FA5] rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 transform translate-x-12 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="bg-[#3D9DA0]/30 text-[#83C9B8] text-xs px-3 py-1 rounded-full font-semibold border border-[#3D9DA0]/40 backdrop-blur-sm">
                Active Session • {user?.role}
              </span>
              <span className="text-xs text-gray-300">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-heading">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-sm text-gray-200 mt-1 max-w-xl">
              Merald Group Multi-National Corporate Portal & HR Analytics System.
              {user?.role === 'SITE_SUPERVISOR' && ' Showing site-scoped operational metrics.'}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/admin/employees"
              className="px-4 py-2.5 bg-[#3D9DA0] hover:bg-[#55B4B7] text-white text-xs font-semibold rounded-lg shadow-md transition-all flex items-center"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Add Employee
            </Link>
            <Link
              to="/admin/reports"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg border border-white/20 backdrop-blur-sm transition-all flex items-center"
            >
              <FileText className="w-4 h-4 mr-1.5" /> Reports
            </Link>
          </div>
        </div>
      </motion.div>

      {/* RBAC Financial Access Notice Badge */}
      <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-2xs text-xs">
        <div className="flex items-center space-x-2 text-[#0D2E45]">
          <Shield className="w-4 h-4 text-[#3D9DA0]" />
          <span className="font-semibold">RBAC Matrix Scope:</span>
          <span className="text-gray-600">Assigned Role ({user?.role})</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            {canSeeFinancials ? (
              <Eye className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <EyeOff className="w-3.5 h-3.5 text-amber-600" />
            )}
            <span className={canSeeFinancials ? 'text-emerald-700 font-semibold' : 'text-amber-700 font-semibold'}>
              Financial Data: {canSeeFinancials ? 'FULL ACCESS' : 'MASKED / BLOCKED'}
            </span>
          </div>

          {canSeeAuditLogs && (
            <div className="hidden sm:flex items-center space-x-1 text-gray-500">
              <span>• Audit Logs: Read Allowed</span>
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Employees */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Total Headcount
              </p>
              <h3 className="text-2xl font-bold text-[#0D2E45] mt-1">
                {metrics.totalEmployees}
              </h3>
              <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-1" /> +12 this month
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1D6FA5] flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

        {/* Card 2: Active Sites */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Active Sites / Projects
              </p>
              <h3 className="text-2xl font-bold text-[#0D2E45] mt-1">{metrics.activeSites}</h3>
              <p className="text-[11px] text-gray-500 font-medium mt-1">
                Across 5 countries (NG, IN, UAE, GH, UG)
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#3D9DA0] flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

        {/* Card 3: Document Expiry Alerts */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white p-5 rounded-xl border border-amber-200 bg-amber-50/30 shadow-2xs relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                Doc Expiry Alerts
              </p>
              <h3 className="text-2xl font-bold text-amber-900 mt-1">
                {metrics.documentExpiryCount}
              </h3>
              <p className="text-[11px] text-amber-700 font-medium mt-1 flex items-center">
                <AlertCircle className="w-3.5 h-3.5 mr-1 text-amber-600" /> Expiring within 30 days
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

        {/* Card 4: Attendance Roster Today */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Today's Attendance
              </p>
              <h3 className="text-2xl font-bold text-[#0D2E45] mt-1">
                {metrics.todayAttendancePercentage}%
              </h3>
              <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center">
                <UserCheck className="w-3.5 h-3.5 mr-1" /> 457 Checked In
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CalendarCheck className="w-6 h-6" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Grid Section: Document Expiry Alerts & Country Headcount */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Document Expiry Warning Widget */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-[#0D2E45] flex items-center">
                <AlertTriangle className="w-5 h-5 text-amber-500 mr-2" />
                Legal Document Expiry Warning Matrix
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Work Permits, Visas, and Passports requiring urgent HR/Legal renewal.
              </p>
            </div>
            <Link
              to="/admin/employees"
              className="text-xs font-semibold text-[#1D6FA5] hover:underline flex items-center"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F7F9FA] text-[#0D2E45] font-semibold border-b border-gray-200">
                  <th className="py-2.5 px-3">Employee</th>
                  <th className="py-2.5 px-3">Doc Type</th>
                  <th className="py-2.5 px-3">Site Location</th>
                  <th className="py-2.5 px-3">Expiry Date</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {metrics.documentExpiryAlerts.map((item) => (
                  <tr key={item.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-[#0D2E45]">{item.employeeName}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{item.employeeCode}</div>
                    </td>
                    <td className="py-3 px-3 font-medium text-gray-700">{item.documentType}</td>
                    <td className="py-3 px-3 text-gray-600">{item.site}</td>
                    <td className="py-3 px-3 font-mono text-gray-600">{item.expiryDate}</td>
                    <td className="py-3 px-3 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.daysRemaining <= 14
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.daysRemaining} days left
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Column: Country Headcount Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-2xs p-6 space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-[#0D2E45]">Global Workforce Distribution</h3>
            <p className="text-xs text-gray-500 mt-0.5">Headcount across active country hubs</p>
          </div>

          <div className="space-y-4">
            {metrics.headcountByCountry.map((c) => {
              const maxHeadcount = 200;
              const percentage = Math.round((c.headcount / maxHeadcount) * 100);

              return (
                <div key={c.country} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#0D2E45]">{c.country}</span>
                    <span className="text-gray-600 font-mono">
                      {c.headcount} staff ({c.sites} sites)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#14476B] to-[#3D9DA0] rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-gray-100">
            <div className="p-3 bg-[#E4F5EE] rounded-lg border border-[#83C9B8]/40 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#0D2E45]">Manpower Shortfall Matrix</p>
                <p className="text-[10px] text-gray-600">Contracted vs. Actual site deployment</p>
              </div>
              <span className="text-sm font-bold text-[#D64545] font-mono">
                -{metrics.manpowerShortfall} Workers
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed & Quick Links */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xs p-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
          <h3 className="text-base font-bold text-[#0D2E45] flex items-center">
            <Clock className="w-5 h-5 text-[#1D6FA5] mr-2" />
            Recent Operational Activity Audit Trail
          </h3>
          <span className="text-xs text-gray-400">Real-time system events</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.recentActivities.map((act) => (
            <div
              key={act.id}
              className="p-3.5 bg-[#F7F9FA] rounded-lg border border-gray-100 space-y-1 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center justify-between text-[10px] text-gray-400">
                <span className="font-bold text-[#14476B] tracking-wider">{act.type}</span>
                <span>{act.timestamp}</span>
              </div>
              <p className="text-xs text-[#1A1F24] font-medium leading-snug">
                {act.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
