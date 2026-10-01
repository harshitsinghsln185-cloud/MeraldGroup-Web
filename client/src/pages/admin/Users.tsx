import React, { useState, useEffect, useCallback } from 'react';
import {
  Users as UsersIcon,
  UserCheck,
  UserX,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Trash2,
  Mail,
  Building2,
  Phone,
} from 'lucide-react';
import { useAuth, type UserRole } from '../../context/AuthContext';
import { Heading, Text } from '../../components/ui/Typography';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export interface SystemUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  phone?: string;
  isApproved: boolean;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: {
    name: string;
    email: string;
  };
  approvedAt?: string;
  createdAt: string;
}

export const Users: React.FC = () => {
  const { token, user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'pending' | 'active'>('pending');
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [selectedRoles, setSelectedRoles] = useState<Record<string, UserRole>>({});

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch(`/api/v1/admin/users?search=${search}&role=${roleFilter}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.data) {
        setUsers(data.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch system users:', err);
    } finally {
      setLoading(false);
    }
  }, [token, search, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleApprove = async (userId: string) => {
    const assignedRole = selectedRoles[userId] || 'SITE_SUPERVISOR';
    try {
      const res = await fetch(`/api/v1/admin/users/${userId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: assignedRole }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: data.message || 'User approved successfully.' });
        fetchUsers();
      } else {
        setMessage({ type: 'error', text: data.error?.message || 'Failed to approve user.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error executing request' });
    }
  };

  const handleReject = async (userId: string) => {
    try {
      const res = await fetch(`/api/v1/admin/users/${userId}/reject`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: data.message || 'User request rejected.' });
        fetchUsers();
      } else {
        setMessage({ type: 'error', text: data.error?.message || 'Failed to reject request.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error executing request' });
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user account?')) return;
    try {
      const res = await fetch(`/api/v1/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: data.message || 'User account deleted.' });
        fetchUsers();
      } else {
        setMessage({ type: 'error', text: data.error?.message || 'Failed to delete user.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error deleting account' });
    }
  };

  const pendingUsers = users.filter((u) => !u.isApproved && u.approvalStatus !== 'REJECTED');
  const activeUsers = users.filter((u) => u.isApproved && u.approvalStatus === 'APPROVED');

  return (
    <div className="space-y-6 font-body">
      {/* Page Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Heading level={1} color="navy" className="text-2xl font-bold flex items-center gap-2">
            <UsersIcon className="w-7 h-7 text-teal-600" /> User Management & HR Approvals
          </Heading>
          <Text size="small" color="muted">
            Manage system access, RBAC permissions, and HR account registration approvals.
          </Text>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'pending'
              ? 'bg-navy-900 text-white shadow-sm'
              : 'text-gray-600 hover:text-navy-900'
              }`}
          >
            <Clock className="w-4 h-4 text-amber-400" />
            Pending HR Approvals ({pendingUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'active'
              ? 'bg-navy-900 text-white shadow-sm'
              : 'text-gray-600 hover:text-navy-900'
              }`}
          >
            <UserCheck className="w-4 h-4 text-mint-400" />
            Active Users ({activeUsers.length})
          </button>
        </div>
      </div>

      {/* Alert Messages */}
      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between ${message.type === 'success'
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
            : 'bg-red-50 border border-red-200 text-red-900'
            }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-gray-400 hover:text-gray-600">
            &times;
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <Card className="p-4 bg-white border border-gray-200 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-grow max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name, email, department..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All Roles</option>
            <option value="HR">HR Manager</option>
            <option value="ACCOUNTS">Accounts / Payroll</option>
            <option value="ADMIN">System Admin</option>
            <option value="SITE_SUPERVISOR">Site Supervisor</option>
          </select>
        </div>
      </Card>

      {/* Content Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center text-xs text-gray-400 shadow-sm border border-gray-200">
          Loading system user directory...
        </div>
      ) : activeTab === 'pending' ? (
        /* ---------------- PENDING APPROVALS LIST ---------------- */
        pendingUsers.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <Heading level={3} color="navy" className="text-base font-bold">No Pending Approvals</Heading>
            <Text size="small" color="muted">All account requests have been reviewed by HR.</Text>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingUsers.map((u) => (
              <Card key={u._id} borderAccent className="p-6 bg-white border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="warning" className="mb-2 text-[11px] font-bold inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" /> PENDING HR APPROVAL
                    </Badge>
                    <Heading level={3} color="navy" className="text-lg font-bold">{u.name}</Heading>
                    <div className="space-y-1 text-xs text-gray-600 mt-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                        <span>{u.email}</span>
                      </div>
                      {u.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                          <span>{u.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                        <span>Department: {u.department || 'General'}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] text-gray-400 font-mono">
                    Requested: {new Date(u.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Role Assignment & Action Panel */}
                <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-700">Assign Role:</span>
                    <select
                      value={selectedRoles[u._id] || 'SITE_SUPERVISOR'}
                      onChange={(e) =>
                        setSelectedRoles((prev) => ({ ...prev, [u._id]: e.target.value as UserRole }))
                      }
                      className="text-xs bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 font-bold text-navy-900 focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="SITE_SUPERVISOR">Site Supervisor</option>
                      <option value="HR">HR Manager</option>
                      <option value="ACCOUNTS">Accounts / Payroll</option>
                      <option value="ADMIN">System Admin</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleReject(u._id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50 text-xs font-bold"
                    >
                      <UserX className="w-3.5 h-3.5 mr-1" /> Reject
                    </Button>
                    <Button
                      onClick={() => handleApprove(u._id)}
                      variant="primary"
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                    >
                      <UserCheck className="w-3.5 h-3.5 mr-1" /> Approve Account
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      ) : (
        /* ---------------- ACTIVE APPROVED USERS LIST ---------------- */
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-900 text-white font-heading font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">User Details</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Assigned Role</th>
                  <th className="p-4">Approval Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activeUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-navy-900 text-sm">{u.name}</div>
                      <div className="text-gray-500">{u.email}</div>
                    </td>
                    <td className="p-4 text-gray-700 font-medium">{u.department || 'General'}</td>
                    <td className="p-4">
                      <Badge
                        variant={
                          u.role === 'HR'
                            ? 'mint'
                            : u.role === 'ACCOUNTS'
                              ? 'teal'
                              : u.role === 'ADMIN'
                                ? 'warning'
                                : 'navy'
                        }
                        className="font-bold text-[11px]"
                      >
                        {u.role}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        <ShieldCheck className="w-3.5 h-3.5" /> Approved
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {currentUser?.id !== u._id && (
                        <button
                          onClick={() => handleDelete(u._id)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete User Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
