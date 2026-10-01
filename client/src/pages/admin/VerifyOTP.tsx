import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const VerifyOTP: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = (location.state as { email?: string })?.email || 'hr@meraldgroup.com';

  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/v1/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailFromState, otp }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        navigate('/reset-password', { state: { email: emailFromState, otp } });
      } else {
        setErrorMessage(data.error?.message || 'Invalid or expired OTP code.');
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
        <Link
          to="/forgot-password"
          className="inline-flex items-center text-xs font-semibold text-[#14476B] hover:text-[#3D9DA0] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
        </Link>

        <div className="w-12 h-12 bg-[#E4F5EE] text-[#3D9DA0] rounded-xl flex items-center justify-center mb-4">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <h2 className="text-xl font-bold text-[#0D2E45]">Verify OTP Code</h2>
        <p className="text-xs text-gray-500 mt-1 mb-6">
          Enter the 6-digit OTP code sent to <strong className="text-[#0D2E45]">{emailFromState}</strong>.
        </p>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-[#D64545] border border-red-200 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#0D2E45] uppercase tracking-wider mb-1.5">
              6-Digit Numeric OTP
            </label>
            <input
              type="text"
              maxLength={6}
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              className="w-full text-center text-2xl font-mono tracking-widest py-3 bg-[#F7F9FA] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D9DA0] text-[#0D2E45]"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || otp.length < 6}
            className="w-full py-3 bg-[#14476B] hover:bg-[#0D2E45] text-white font-semibold rounded-lg shadow-md flex items-center justify-center"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
            <CheckCircle className="w-4 h-4 ml-2" />
          </Button>
        </form>
      </div>
    </div>
  );
};
