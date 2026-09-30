import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, type SystemModule } from '../../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  moduleRequired?: SystemModule;
  writeRequired?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  moduleRequired,
  writeRequired = false,
}) => {
  const { isAuthenticated, isLoading, hasModuleAccess, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FA]">
        <div className="w-10 h-10 border-4 border-[#3D9DA0] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (moduleRequired && !hasModuleAccess(moduleRequired, writeRequired ? 'write' : 'read')) {
    return (
      <div className="p-8 max-w-2xl mx-auto my-12 bg-white rounded-xl shadow-md border border-red-100 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto text-[#D64545] mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#0D2E45]">Access Restricted (RBAC Protection)</h2>
        <p className="text-sm text-gray-600 mt-2">
          Your current assigned role <span className="font-semibold text-[#14476B]">({user?.role})</span> does not have permissions to access the <span className="font-semibold">{moduleRequired}</span> module.
        </p>
        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-xs text-gray-500 text-left font-mono">
          <div>Role: {user?.role}</div>
          <div>User: {user?.name} ({user?.email})</div>
          <div>Module: {moduleRequired}</div>
          <div>Permission Required: {writeRequired ? 'WRITE / FULL_ACCESS' : 'READ'}</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
