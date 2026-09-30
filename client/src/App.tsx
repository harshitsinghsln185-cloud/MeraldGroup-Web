import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Import i18n config
import './config/i18n/i18n';

// Auth Context & Protected Route
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

// Public Layout Components
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { LoadingScreen } from './components/ui/LoadingScreen';

// Admin Layout
import { AdminLayout } from './components/layout/AdminLayout';

// Public Pages
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { Countries } from './pages/Countries';
import { CountryDetail } from './pages/CountryDetail';
import { About } from './pages/About';
import { Jobs } from './pages/Jobs';
import { Contact } from './pages/Contact';

// Admin Auth Pages
import { Login } from './pages/admin/Login';
import { ForgotPassword } from './pages/admin/ForgotPassword';
import { VerifyOTP } from './pages/admin/VerifyOTP';
import { ResetPassword } from './pages/admin/ResetPassword';

// Admin Content Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { Employees } from './pages/admin/Employees';
import { Attendance } from './pages/admin/Attendance';
import { Leave } from './pages/admin/Leave';
import { Payroll } from './pages/admin/Payroll';
import { Manpower } from './pages/admin/Manpower';
import { Clearance } from './pages/admin/Clearance';
import { Reports } from './pages/admin/Reports';
import { Settings } from './pages/admin/Settings';
import { Users } from './pages/admin/Users';

// Placeholder Component for future HR Modules in Phase 4/5
const ModulePlaceholder: React.FC<{ title: string; description: string }> = ({
  title,
  description,
}) => (
  <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-2xs text-center space-y-3">
    <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#3D9DA0] font-bold text-xl flex items-center justify-center mx-auto">
      M
    </div>
    <h2 className="text-xl font-bold text-[#0D2E45]">{title} Module</h2>
    <p className="text-xs text-gray-500 max-w-md mx-auto">{description}</p>
    <div className="pt-4">
      <span className="inline-block text-[11px] px-3 py-1 bg-teal-100 text-[#0D2E45] font-semibold rounded-full border border-teal-200">
        Phase 3 HR Engine Connected • Ready for Phase 4 Payroll Engine
      </span>
    </div>
  </div>
);

export const App: React.FC = () => {
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  useEffect(() => {
    // Initial app loading screen timer (capped at 1.5s)
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <HelmetProvider>
      <AuthProvider>
        <LoadingScreen isLoading={initialLoading} />

        <Router>
          <Routes>
            {/* ---------------- PUBLIC MARKETING PORTAL ---------------- */}
            <Route
              path="/*"
              element={
                <div className="min-h-screen flex flex-col bg-[#F7F9FA]">
                  <Header />
                  <main className="flex-grow pt-20">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/countries" element={<Countries />} />
                      <Route path="/countries/:slug" element={<CountryDetail />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/jobs" element={<Jobs />} />
                      <Route path="/contact" element={<Contact />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              }
            />

            {/* ---------------- ADMIN AUTHENTICATION FLOW ---------------- */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* ---------------- PROTECTED ADMIN SYSTEM ---------------- */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Routes>
                      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                      <Route path="/dashboard" element={<AdminDashboard />} />

                      <Route
                        path="/employees"
                        element={
                          <ProtectedRoute moduleRequired="employee_master_data">
                            <Employees />
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/attendance"
                        element={
                          <ProtectedRoute moduleRequired="daily_attendance">
                            <Attendance />
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/leave"
                        element={
                          <ProtectedRoute moduleRequired="leave_approval">
                            <Leave />
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/payroll"
                        element={
                          <ProtectedRoute moduleRequired="payroll_processing">
                            <Payroll />
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/manpower"
                        element={
                          <ProtectedRoute moduleRequired="manpower_management">
                            <Manpower />
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/sites"
                        element={
                          <ProtectedRoute moduleRequired="sites_departments">
                            <ModulePlaceholder
                              title="Sites & Project Locations"
                              description="Manage corporate offices, construction sites, and site supervisor assignments."
                            />
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/joining-exit"
                        element={<Clearance />}
                      />

                      <Route
                        path="/reports"
                        element={
                          <ProtectedRoute moduleRequired="hr_operational_reports">
                            <Reports />
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/users"
                        element={
                          <ProtectedRoute moduleRequired="system_settings">
                            <Users />
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/settings"
                        element={
                          <ProtectedRoute moduleRequired="system_settings">
                            <Settings />
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;
