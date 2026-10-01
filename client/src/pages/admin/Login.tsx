import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, type UserRole } from '../../context/AuthContext';
import { Lock, Mail, ArrowRight, User as UserIcon, Building2, Phone, Clock, AlertCircle, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { apiFetch } from '../../config/constants';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Login form state
  const [selectedRole, setSelectedRole] = useState<UserRole>('HR');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regDepartment, setRegDepartment] = useState('Operations');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await apiFetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: selectedRole }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        login(data.data.token, data.data.user);
        navigate('/admin/dashboard');
      } else {
        setErrorMessage(data.error?.message || 'Invalid login credentials');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Server connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await apiFetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          password: regPassword,
          phone: regPhone,
          department: regDepartment,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage('Registration submitted successfully! Your account is pending HR approval. Once approved, you will be able to log in.');
        setIsRegisterMode(false);
        setRegName('');
        setRegEmail('');
        setRegPassword('');
        setRegPhone('');
      } else {
        setErrorMessage(data.error?.message || 'Registration failed');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Server connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D2E45] flex items-center justify-center p-4 relative overflow-hidden font-body">
      {/* Background Decorative Gradient Blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#1D6FA5]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#3D9DA0]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 relative z-10">
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-[#0D2E45] via-[#14476B] to-[#3D9DA0] p-6 sm:p-8 text-center text-white relative">
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto mb-3 text-2xl font-bold font-heading shadow-md">
            M
          </div>
          <h1 className="text-2xl font-bold font-heading tracking-wide">Merald Group</h1>
          <p className="text-xs text-[#83C9B8] mt-1 font-medium tracking-wider uppercase">
            Corporate HR & Admin Portal
          </p>

          {/* Toggle Switch */}
          <div className="mt-4 flex rounded-lg bg-white/10 p-1 backdrop-blur-xs border border-white/15">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(false);
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                !isRegisterMode ? 'bg-white text-[#0D2E45] shadow-xs' : 'text-gray-200 hover:text-white'
              }`}
            >
              Portal Login
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(true);
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                isRegisterMode ? 'bg-white text-[#0D2E45] shadow-xs' : 'text-gray-200 hover:text-white'
              }`}
            >
              Request Account
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {successMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-start">
              <Clock className="w-4 h-4 text-emerald-600 mr-2 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-[#D64545] text-xs font-medium flex items-start">
              <AlertCircle className="w-4 h-4 text-red-600 mr-2 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {!isRegisterMode ? (
            /* ---------------- LOGIN FORM ---------------- */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="flex items-center justify-between text-xs font-semibold text-[#0D2E45] uppercase tracking-wider mb-1.5">
                  <span>Target Access Role</span>
                  <span className="text-[10px] text-gray-500 font-normal lowercase">(Required for login authorization)</span>
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="w-full pl-9 pr-8 py-2.5 text-sm bg-[#F7F9FA] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D9DA0] transition-all text-[#1A1F24] font-medium appearance-none cursor-pointer"
                  >
                    <option value="HR">HR Manager (HR)</option>
                    <option value="ACCOUNTS">Finance & Payroll (ACCOUNTS)</option>
                    <option value="ADMIN">System Administrator (ADMIN)</option>
                    <option value="SITE_SUPERVISOR">Site Supervisor (SITE_SUPERVISOR)</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-gray-400">
                    ▼
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0D2E45] uppercase tracking-wider mb-1.5">
                  Corporate Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@meraldgroup.com"
                    className="w-full pl-9 pr-4 py-2.5 text-sm bg-[#F7F9FA] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D9DA0] transition-all text-[#1A1F24]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#0D2E45] uppercase tracking-wider">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-[#1D6FA5] hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-4 py-2.5 text-sm bg-[#F7F9FA] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D9DA0] transition-all text-[#1A1F24]"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 bg-[#14476B] hover:bg-[#0D2E45] text-white font-semibold rounded-lg shadow-md flex items-center justify-center transition-all"
              >
                {isLoading ? 'Authenticating...' : 'Sign In to Portal'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          ) : (
            /* ---------------- ACCOUNT REGISTRATION FORM ---------------- */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#0D2E45] uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full pl-9 pr-4 py-2 text-sm bg-[#F7F9FA] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D9DA0] transition-all text-[#1A1F24]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0D2E45] uppercase tracking-wider mb-1">
                  Corporate Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@meraldgroup.com"
                    className="w-full pl-9 pr-4 py-2 text-sm bg-[#F7F9FA] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D9DA0] transition-all text-[#1A1F24]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0D2E45] uppercase tracking-wider mb-1">
                  Phone / Mobile
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+234 / +91 / +971"
                    className="w-full pl-9 pr-4 py-2 text-sm bg-[#F7F9FA] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D9DA0] transition-all text-[#1A1F24]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0D2E45] uppercase tracking-wider mb-1">
                  Department
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={regDepartment}
                    onChange={(e) => setRegDepartment(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm bg-[#F7F9FA] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D9DA0] transition-all text-[#1A1F24]"
                  >
                    <option value="Human Resources">Human Resources</option>
                    <option value="Finance & Accounts">Finance & Accounts</option>
                    <option value="MEP Operations">MEP Operations</option>
                    <option value="Site Management">Site Management</option>
                    <option value="Logistics / Haulify">Logistics / Haulify</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0D2E45] uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Set account password"
                    className="w-full pl-9 pr-4 py-2 text-sm bg-[#F7F9FA] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D9DA0] transition-all text-[#1A1F24]"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900 font-body">
                <span className="font-bold">Note:</span> New account requests require HR verification and manual approval before access is granted.
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 bg-[#3D9DA0] hover:bg-[#14476B] text-white font-semibold rounded-lg shadow-md flex items-center justify-center transition-all"
              >
                {isLoading ? 'Submitting Request...' : 'Submit Request for HR Approval'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500 font-body">
              Protected Enterprise Management Portal • Merald Group ISO 9001 Certified
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
