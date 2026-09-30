import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Calendar,
  Plus,
  Filter,
  XCircle,
} from 'lucide-react';

export interface LeaveRecord {
  _id: string;
  employeeCode: string;
  employeeName: string;
  leaveType: 'ANNUAL' | 'SICK' | 'EMERGENCY' | 'UNPAID';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
  rejectionReason?: string;
  createdAt: string;
}

export const Leave: React.FC = () => {
  const { user, getModulePermission } = useAuth();
  const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [applyModal, setApplyModal] = useState<boolean>(false);
  const [actionModal, setActionModal] = useState<LeaveRecord | null>(null);

  // Apply Form State
  const [employeeCode] = useState('MRLD-NIG-042');
  const [employeeName] = useState('Emmanuel Chukwu');
  const [leaveType, setLeaveType] = useState<'ANNUAL' | 'SICK' | 'EMERGENCY' | 'UNPAID'>('ANNUAL');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-10-10');
  const [totalDays, setTotalDays] = useState<number>(10);
  const [reason, setReason] = useState('Annual family leave entitlement');

  // Approval Action State
  const [actionNotes, setActionNotes] = useState('');

  const canApprove = getModulePermission('leave_approval') === 'FULL_ACCESS';



  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const token = localStorage.getItem('merald_token');
        const res = await fetch('/api/v1/admin/leave', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.success && data.data) {
          setLeaves(data.data);
        } else {
          setLeaves([]);
        }
      } catch {
        setLeaves([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  const filteredLeaves = leaves.filter((item) => {
    return statusFilter ? item.status === statusFilter : true;
  });

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLeave: LeaveRecord = {
      _id: `leave-${Date.now()}`,
      employeeCode,
      employeeName,
      leaveType,
      startDate,
      endDate,
      totalDays,
      reason,
      status: 'PENDING',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setLeaves([newLeave, ...leaves]);
    setApplyModal(false);
  };

  const handleUpdateStatus = (newStatus: 'APPROVED' | 'REJECTED') => {
    if (!actionModal) return;

    const updated = leaves.map((l) => {
      if (l._id === actionModal._id) {
        return {
          ...l,
          status: newStatus,
          approvedBy: user?.email || 'HR Manager',
          rejectionReason: newStatus === 'REJECTED' ? actionNotes || 'Schedule conflict' : undefined,
        };
      }
      return l;
    });

    setLeaves(updated);
    setActionModal(null);
    setActionNotes('');
  };

  return (
    <div className="space-y-6 font-body">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2 text-[#0D2E45] mb-1">
            <Calendar className="w-6 h-6 text-[#3D9DA0]" />
            <h1 className="text-2xl font-bold font-heading">Leave Management Workflow</h1>
          </div>
          <p className="text-xs text-gray-500">
            Employee leave applications, manager approval/rejection ledger, and leave balance tracking.
          </p>
        </div>

        <button
          onClick={() => setApplyModal(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-[#0D2E45] to-[#1D6FA5] hover:opacity-90 text-white text-xs font-bold rounded-lg shadow-md transition-all flex items-center shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Apply for Leave
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
          <p className="text-xs font-semibold text-gray-500 uppercase">Pending Review</p>
          <h3 className="text-2xl font-bold text-amber-600 mt-1">
            {leaves.filter((l) => l.status === 'PENDING').length} Requests
          </h3>
          <p className="text-[11px] text-amber-700 mt-1">Requires HR / Manager action</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
          <p className="text-xs font-semibold text-gray-500 uppercase">Approved This Month</p>
          <h3 className="text-2xl font-bold text-emerald-700 mt-1">
            {leaves.filter((l) => l.status === 'APPROVED').length} Approved
          </h3>
          <p className="text-[11px] text-emerald-600 mt-1">Roster updated</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
          <p className="text-xs font-semibold text-gray-500 uppercase">Average Leave Duration</p>
          <h3 className="text-2xl font-bold text-[#0D2E45] mt-1">5.2 Days</h3>
          <p className="text-[11px] text-gray-500 mt-1">Annual & Sick leave average</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-xs font-semibold text-[#0D2E45]">
          <Filter className="w-4 h-4 text-[#3D9DA0]" />
          <span>Filter Status:</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setStatusFilter('')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              statusFilter === '' ? 'bg-[#0D2E45] text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            All Requests
          </button>
          <button
            onClick={() => setStatusFilter('PENDING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'PENDING' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Pending Only
          </button>
          <button
            onClick={() => setStatusFilter('APPROVED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'APPROVED' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setStatusFilter('REJECTED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'REJECTED' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Rejected
          </button>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading leave requests...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F7F9FA] text-[#0D2E45] font-bold uppercase tracking-wider border-b border-gray-200">
                  <th className="py-3.5 px-4">Employee</th>
                  <th className="py-3.5 px-4">Leave Type</th>
                  <th className="py-3.5 px-4">Date Range & Duration</th>
                  <th className="py-3.5 px-4">Reason</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLeaves.map((l) => (
                  <tr key={l._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#0D2E45]">{l.employeeName}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{l.employeeCode}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded font-bold text-[10px] bg-blue-50 text-[#1D6FA5] border border-blue-100">
                        {l.leaveType}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <p className="text-gray-700">{l.startDate} to {l.endDate}</p>
                      <p className="text-[10px] text-gray-500">{l.totalDays} Days Duration</p>
                    </td>

                    <td className="py-3.5 px-4 text-gray-600 max-w-[200px] truncate">
                      {l.reason}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          l.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : l.status === 'REJECTED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {l.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {canApprove && l.status === 'PENDING' ? (
                        <button
                          onClick={() => setActionModal(l)}
                          className="px-3 py-1 bg-[#3D9DA0] hover:bg-[#55B4B7] text-white text-[11px] font-bold rounded shadow-xs cursor-pointer"
                        >
                          Review Request
                        </button>
                      ) : (
                        <span className="text-[11px] text-gray-400 font-mono">
                          {l.status === 'APPROVED' ? 'Approved' : l.status === 'REJECTED' ? 'Rejected' : 'Pending Review'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Apply Leave Modal */}
      {applyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full relative shadow-2xl">
            <button
              onClick={() => setApplyModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
            >
              <XCircle className="w-6 h-6" />
            </button>

            <h2 className="text-xl font-bold font-heading text-[#0D2E45] mb-1">
              Submit Leave Application
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              Enter leave duration dates and reason for manager approval.
            </p>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#0D2E45] mb-1">Leave Category *</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white"
                >
                  <option value="ANNUAL">Annual Leave</option>
                  <option value="SICK">Sick Leave</option>
                  <option value="EMERGENCY">Emergency Leave</option>
                  <option value="UNPAID">Unpaid Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0D2E45] mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0D2E45] mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0D2E45] mb-1">Total Days *</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="60"
                  value={totalDays}
                  onChange={(e) => setTotalDays(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0D2E45] mb-1">Reason / Notes *</label>
                <textarea
                  rows={3}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setApplyModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0D2E45] text-white text-xs font-bold rounded-lg hover:bg-[#14476B]"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Action Modal */}
      {actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full relative shadow-2xl">
            <button
              onClick={() => setActionModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
            >
              <XCircle className="w-6 h-6" />
            </button>

            <h2 className="text-xl font-bold font-heading text-[#0D2E45] mb-1">
              Review Leave Application
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              {actionModal.employeeName} ({actionModal.employeeCode}) — {actionModal.totalDays} Days ({actionModal.leaveType})
            </p>

            <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-700 mb-4 border border-gray-200">
              <strong>Reason:</strong> {actionModal.reason}
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-[#0D2E45] mb-1">Approval / Rejection Notes</label>
              <textarea
                rows={3}
                placeholder="Optional notes or reason if rejecting..."
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => handleUpdateStatus('REJECTED')}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Reject Request
              </button>

              <button
                type="button"
                onClick={() => handleUpdateStatus('APPROVED')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Approve Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leave;
