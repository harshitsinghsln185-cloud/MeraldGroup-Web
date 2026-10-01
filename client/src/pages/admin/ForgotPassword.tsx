import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage('A 6-digit OTP code has been dispatched to your corporate email.');
        setTimeout(() => {
          navigate('/verify-otp', { state: { email } });
        }, 1500);
      } else {
        setMessage(data.error?.message || 'Failed to send OTP code. Please verify your email.');
      }
    } catch {
      setMessage('Server connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D2E45] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        <Link
          to="/admin/login"
          className="inline-flex items-center text-xs font-semibold text-[#14476B] hover:text-[#3D9DA0] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Sign In
        </Link>

        <h2 className="text-xl font-bold text-[#0D2E45]">Reset Portal Password</h2>
        <p className="text-xs text-gray-500 mt-1 mb-6">
          Enter your corporate email address. We will send you a 6-digit numeric OTP code.
        </p>

        {message && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-[#F7F9FA] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D9DA0] text-[#1A1F24]"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#14476B] hover:bg-[#0D2E45] text-white font-semibold rounded-lg shadow-md flex items-center justify-center"
          >
            {isLoading ? 'Sending OTP...' : 'Send Reset OTP'}
            <Send className="w-4 h-4 ml-2" />
          </Button>
        </form>
      </div>
    </div>
  );
};
