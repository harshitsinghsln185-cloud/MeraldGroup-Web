import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, type UserRole } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  FileCheck,
  CreditCard,
  BarChart3,
  MapPin,
  UserPlus,
  FileSpreadsheet,
  ShieldCheck,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  User,
  ExternalLink,
} from 'lucide-react';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  module?: string;
  rolesAllowed?: UserRole[];
}

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, demoLogin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      label: 'Employees Master Data',
      path: '/admin/employees',
      icon: <Users className="w-5 h-5" />,
      module: 'employee_master_data',
    },
    {
      label: 'Attendance & Roster',
      path: '/admin/attendance',
      icon: <CalendarCheck className="w-5 h-5" />,
      module: 'daily_attendance',
    },
    {
      label: 'Leave Management',
      path: '/admin/leave',
      icon: <FileCheck className="w-5 h-5" />,
      module: 'leave_approval',
    },
    {
      label: 'Payroll & Compensation',
      path: '/admin/payroll',
      icon: <CreditCard className="w-5 h-5" />,
      module: 'payroll_processing',
      rolesAllowed: ['HR', 'ACCOUNTS'],
    },
    {
      label: 'Manpower Supply',
      path: '/admin/manpower',
      icon: <BarChart3 className="w-5 h-5" />,
      module: 'manpower_management',
    },
    {
      label: 'Sites & Locations',
      path: '/admin/sites',
      icon: <MapPin className="w-5 h-5" />,
      module: 'sites_departments',
    },
    {
      label: 'Onboarding & Exit',
      path: '/admin/joining-exit',
      icon: <UserPlus className="w-5 h-5" />,
    },
    {
      label: 'Reports & Analytics',
      path: '/admin/reports',
      icon: <FileSpreadsheet className="w-5 h-5" />,
      module: 'hr_operational_reports',
    },
    {
      label: 'Users & RBAC Roles',
      path: '/admin/users',
      icon: <ShieldCheck className="w-5 h-5" />,
      rolesAllowed: ['HR', 'ACCOUNTS'],
    },
    {
      label: 'System Settings',
      path: '/admin/settings',
      icon: <Settings className="w-5 h-5" />,
      rolesAllowed: ['HR', 'ACCOUNTS'],
    },
  ];

  const getRoleBadgeColor = (role?: UserRole) => {
    switch (role) {
      case 'HR':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'ACCOUNTS':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ADMIN':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'SITE_SUPERVISOR':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#F7F9FA] flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#0D2E45] text-white px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-300 hover:text-white rounded-lg focus:outline-none"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <span className="font-bold text-lg font-heading tracking-wide">Merald Admin</span>
        </div>
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${getRoleBadgeColor(
            user?.role
          )}`}
        >
          {user?.role}
        </span>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#0D2E45] text-white flex flex-col transition-transform duration-300 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } shadow-xl border-r border-[#14476B]`}
      >
        {/* Brand Header */}
        <div className="px-6 py-5 border-b border-[#14476B] flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#14476B] via-[#3D9DA0] to-[#83C9B8] flex items-center justify-center font-bold text-lg text-white shadow-sm">
              M
            </div>
            <div>
              <h1 className="font-bold font-heading text-lg leading-tight tracking-wide text-white">
                Merald Group
              </h1>
              <p className="text-[11px] text-[#83C9B8] tracking-wider uppercase font-medium">
                HR & Enterprise Portal
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isRoleRestricted =
              item.rolesAllowed && user?.role && !item.rolesAllowed.includes(user.role);

            if (isRoleRestricted) {
              return null; // Hide restricted navigation items
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#1D6FA5] to-[#3D9DA0] text-white shadow-md'
                    : 'text-gray-300 hover:bg-[#14476B]/60 hover:text-white'
                }`}
              >
                <span className="mr-3 text-white/90">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* RBAC Role Switcher (Convenient Demo Widget) */}
        <div className="p-3 bg-[#081B29] border-t border-[#14476B]">
          <div className="text-[11px] text-gray-400 font-semibold tracking-wider uppercase mb-2">
            Switch Demo RBAC Role:
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {(['HR', 'ACCOUNTS', 'ADMIN', 'SITE_SUPERVISOR'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => demoLogin(r)}
                className={`text-[11px] py-1 px-2 rounded font-medium transition-colors ${
                  user?.role === r
                    ? 'bg-[#3D9DA0] text-white shadow-sm font-bold'
                    : 'bg-[#14476B]/40 text-gray-300 hover:bg-[#14476B] hover:text-white'
                }`}
              >
                {r === 'SITE_SUPERVISOR' ? 'SUPERVISOR' : r}
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar Footer Link to Public Website */}
        <div className="p-4 border-t border-[#14476B] flex items-center justify-between text-xs text-gray-300">
          <Link
            to="/"
            target="_blank"
            className="flex items-center hover:text-[#83C9B8] transition-colors"
          >
            <span>Public Marketing Site</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>
      </aside>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          {/* Search Bar */}
          <div className="relative w-64 md:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees, sites, documents..."
              className="w-full pl-9 pr-4 py-1.5 text-xs md:text-sm bg-[#F7F9FA] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D9DA0] focus:border-transparent transition-all"
            />
          </div>

          {/* Top Right Controls */}
          <div className="flex items-center space-x-3 md:space-x-5">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Notifications Bell */}
            <button className="relative p-2 text-gray-500 hover:text-[#0D2E45] hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D64545] rounded-full ring-2 ring-white"></span>
            </button>

            {/* Role Badge */}
            <div className="hidden sm:flex items-center">
              <span
                className={`text-xs px-3 py-1 rounded-full font-bold border ${getRoleBadgeColor(
                  user?.role
                )}`}
              >
                ROLE: {user?.role}
              </span>
            </div>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-[#14476B] text-white flex items-center justify-center font-bold text-sm">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-semibold text-[#0D2E45] truncate max-w-[120px]">
                    {user?.name}
                  </p>
                  <p className="text-[10px] text-gray-500 truncate max-w-[120px]">{user?.email}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
              </button>

              {userDropdownOpen && (
                <div
                  onMouseLeave={() => setUserDropdownOpen(false)}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-bold text-[#0D2E45]">{user?.name}</p>
                    <p className="text-[11px] text-gray-500">{user?.email}</p>
                    <div className="mt-1">
                      <span
                        className={`inline-block text-[10px] px-2 py-0.5 rounded font-bold border ${getRoleBadgeColor(
                          user?.role
                        )}`}
                      >
                        {user?.role}
                      </span>
                    </div>
                  </div>

                  <Link
                    to="/admin/settings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-xs text-gray-700 hover:bg-gray-50"
                  >
                    <User className="w-4 h-4 mr-2.5 text-gray-400" />
                    Account Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center px-4 py-2 text-xs text-[#D64545] hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2.5 text-[#D64545]" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};
