import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { email?: string; otp?: string };

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/v1/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: state?.email || 'hr@meraldgroup.com',
          otp: state?.otp || '123456',
          newPassword,
        }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage('Password reset successfully! Redirecting to sign in...');
        setTimeout(() => navigate('/admin/login'), 2000);
      } else {
        setErrorMessage(data.error?.message || 'Failed to reset password.');
      }
    } catch {
      setErrorMessage('Server connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D2E45] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        <div className="w-12 h-12 bg-[#E4F5EE] text-[#2E9E5B] rounded-xl flex items-center justify-center mb-4">
          <Lock className="w-6 h-6" />
        </div>

        <h2 className="text-xl font-bold text-[#0D2E45]">Set New Password</h2>
        <p className="text-xs text-gray-500 mt-1 mb-6">
          Create a strong password for your corporate account.
        </p>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-[#D64545] border border-red-200 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 text-[#2E9E5B] border border-emerald-200 text-xs font-medium flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-2 flex-shrink-0" />
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#0D2E45] uppercase tracking-wider mb-1.5">
              New Password
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-2.5 text-sm bg-[#F7F9FA] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D9DA0] text-[#1A1F24]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0D2E45] uppercase tracking-wider mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-2.5 text-sm bg-[#F7F9FA] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D9DA0] text-[#1A1F24]"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#14476B] hover:bg-[#0D2E45] text-white font-semibold rounded-lg shadow-md flex items-center justify-center"
          >
            {isLoading ? 'Updating Password...' : 'Update Password'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>
      </div>
    </div>
  );
};
