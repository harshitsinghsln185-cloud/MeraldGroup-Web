import React, { useEffect, useState } from 'react';
import {
  UserMinus,
  CheckCircle2,
  Clock,
  FileText,
  Printer,
  XCircle,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import { COUNTRIES, apiFetch } from '../../config/constants';

export interface ClearanceItem {
  departmentKey: 'IT' | 'HR' | 'ACCOUNTS' | 'SITE';
  departmentName: string;
  cleared: boolean;
  remarks?: string;
  clearedBy?: string;
  clearedAt?: string;
}

export interface ClearanceRecord {
  _id: string;
  employeeCode: string;
  employeeName: string;
  country: 'Nigeria' | 'India' | 'UAE' | 'Ghana' | 'Uganda';
  department: string;
  designation: string;
  exitReason: string;
  lastWorkingDay: string;
  status: 'IN_PROGRESS' | 'CLEARED' | 'REJECTED';
  clearanceItems: ClearanceItem[];
  nocIssued: boolean;
  nocIssuedDate?: string;
  nocReferenceNo?: string;
}

export const Clearance: React.FC = () => {
  const [clearanceRecords, setClearanceRecords] = useState<ClearanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  
  // NOC Modal state
  const [selectedNocRecord, setSelectedNocRecord] = useState<ClearanceRecord | null>(null);
  const [isNocModalOpen, setIsNocModalOpen] = useState<boolean>(false);

  // New Exit Clearance Modal
  const [isNewModalOpen, setIsNewModalOpen] = useState<boolean>(false);
  const [newEmployeeCode, setNewEmployeeCode] = useState<string>('');
  const [newExitReason, setNewExitReason] = useState<string>('');
  const [newLastWorkingDay, setNewLastWorkingDay] = useState<string>('2026-10-30');

  const fetchClearances = React.useCallback(async () => {
    try {
      let url = '/api/v1/admin/clearance?';
      if (selectedCountry) url += `country=${selectedCountry}&`;
      if (selectedStatus) url += `status=${selectedStatus}&`;

      const res = await apiFetch(url, { credentials: 'include' });
      const data = await res.json();
      if (data.success && data.data) {
        setClearanceRecords(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch exit clearances:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCountry, selectedStatus]);

  useEffect(() => {
    fetchClearances();
  }, [fetchClearances]);



  const handleToggleClearanceItem = async (clearanceId: string, departmentKey: string, currentCleared: boolean) => {
    try {
      const res = await apiFetch(`/api/v1/admin/clearance/${clearanceId}/item`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ departmentKey, cleared: !currentCleared }),
      });
      const data = await res.json();
      if (data.success) {
        fetchClearances();
      }
    } catch (err) {
      console.error('Failed to update clearance item:', err);
    }
  };

  const handleCreateClearance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmployeeCode || !newExitReason) return;
    try {
      const res = await apiFetch('/api/v1/admin/clearance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          employeeCode: newEmployeeCode,
          exitReason: newExitReason,
          lastWorkingDay: newLastWorkingDay,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsNewModalOpen(false);
        setNewEmployeeCode('');
        setNewExitReason('');
        fetchClearances();
      } else {
        alert(data.message || 'Error initiating clearance');
      }
    } catch (err) {
      console.error('Failed to create clearance:', err);
    }
  };

  const handlePrintNoc = () => {
    window.print();
  };

  return (
    <div className="space-[#0D2E45] space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-[#3D9DA0] tracking-wider uppercase">
              Phase 5 Lifecycle Engine
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0D2E45] mt-1 flex items-center gap-2">
            <UserMinus className="w-6 h-6 text-[#3D9DA0]" />
            Onboarding & Exit Clearance Management
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Department clearance checklists (IT, HR, Accounts, Site Equipment) & official No Objection Certificate (NOC) PDF generation.
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0D2E45] text-white text-xs font-semibold rounded-xl hover:bg-[#163f5c] transition-colors shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          Initiate Exit Clearance
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-2xs flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-3 py-2 text-gray-700 bg-gray-50 focus:outline-hidden focus:border-[#3D9DA0]"
          >
            <option value="">All Countries</option>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-3 py-2 text-gray-700 bg-gray-50 focus:outline-hidden focus:border-[#3D9DA0]"
          >
            <option value="">All Clearance Statuses</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="CLEARED">Fully Cleared (NOC Issued)</option>
            <option value="REJECTED">Rejected / Hold</option>
          </select>
        </div>

        <div className="text-xs text-gray-500">
          Showing <span className="font-bold text-[#0D2E45]">{clearanceRecords.length}</span> offboarding records
        </div>
      </div>

      {/* Clearance Cards Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center text-xs text-gray-400">
          Loading exit clearance records...
        </div>
      ) : clearanceRecords.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-xs text-gray-400">
          No offboarding clearance records found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {clearanceRecords.map((c: ClearanceRecord) => {
            const totalItems = c.clearanceItems.length;
            const clearedCount = c.clearanceItems.filter((item: ClearanceItem) => item.cleared).length;
            const percent = Math.round((clearedCount / totalItems) * 100);

            return (
              <div
                key={c._id}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs flex flex-col justify-between space-y-4 hover:border-teal-200 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#3D9DA0]">
                          {c.employeeCode}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-700 font-medium rounded-full">
                          {c.country}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-[#0D2E45] mt-1">{c.employeeName}</h3>
                      <p className="text-xs text-gray-500">
                        {c.designation} • {c.department}
                      </p>
                    </div>

                    <span
                      className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
                        c.status === 'CLEARED'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {c.status === 'CLEARED' ? 'CLEARED & NOC READY' : 'IN PROGRESS'}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase tracking-wider font-semibold">
                        Exit Reason
                      </span>
                      <span>{c.exitReason}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-400 block text-[10px] uppercase tracking-wider font-semibold">
                        Last Working Day
                      </span>
                      <span className="font-semibold text-[#0D2E45]">
                        {new Date(c.lastWorkingDay).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between items-center text-xs mb-1 font-semibold text-[#0D2E45]">
                      <span>Department Clearance Progress</span>
                      <span>{percent}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#3D9DA0] h-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Clearance Checklist Items */}
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {c.clearanceItems.map((item: ClearanceItem) => (
                      <button
                        key={item.departmentKey}
                        onClick={() =>
                          handleToggleClearanceItem(c._id, item.departmentKey, item.cleared)
                        }
                        className={`p-2.5 rounded-xl border text-left flex items-start justify-between transition-colors ${
                          item.cleared
                            ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div>
                          <div className="text-[11px] font-bold">{item.departmentName}</div>
                          <div className="text-[9px] text-gray-500">
                            {item.cleared ? `Cleared by ${item.clearedBy || 'Admin'}` : 'Pending sign-off'}
                          </div>
                        </div>

                        {item.cleared ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-500">
                    {c.nocIssued ? `NOC Ref: ${c.nocReferenceNo}` : 'NOC Locked until 100% cleared'}
                  </span>

                  <button
                    disabled={!c.nocIssued}
                    onClick={() => {
                      setSelectedNocRecord(c);
                      setIsNocModalOpen(true);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      c.nocIssued
                        ? 'bg-[#0D2E45] text-white hover:bg-[#163f5c]'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Official NOC Certificate
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ---------------- NEW CLEARANCE MODAL ---------------- */}
      {isNewModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-[#0D2E45] flex items-center gap-2">
                <UserMinus className="w-5 h-5 text-[#3D9DA0]" />
                Initiate Employee Exit Clearance
              </h3>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClearance} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#0D2E45] mb-1">Employee Code</label>
                <input
                  type="text"
                  placeholder="e.g. MGD-NIG-1001"
                  value={newEmployeeCode}
                  onChange={(e) => setNewEmployeeCode(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:outline-hidden focus:border-[#3D9DA0]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0D2E45] mb-1">Reason for Exit</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Contract completion, Resignation, Relocation"
                  value={newExitReason}
                  onChange={(e) => setNewExitReason(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:outline-hidden focus:border-[#3D9DA0]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0D2E45] mb-1">Last Working Day</label>
                <input
                  type="date"
                  value={newLastWorkingDay}
                  onChange={(e) => setNewLastWorkingDay(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:outline-hidden focus:border-[#3D9DA0]"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0D2E45] text-white rounded-lg font-semibold hover:bg-[#163f5c]"
                >
                  Start Clearance Workflow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- OFFICIAL MERALD GROUP NOC CERTIFICATE MODAL ---------------- */}
      {isNocModalOpen && selectedNocRecord && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-8 shadow-2xl space-y-6 relative border-t-8 border-[#0D2E45]">
            {/* Modal Controls */}
            <div className="flex items-center justify-between no-print border-b pb-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#3D9DA0]">
                <ShieldCheck className="w-4 h-4" />
                Official Verification Document • Merald Group Enterprise HR
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintNoc}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0D2E45] text-white text-xs font-semibold rounded-lg hover:bg-[#163f5c]"
                >
                  <Printer className="w-4 h-4" />
                  Print / Save NOC
                </button>
                <button
                  onClick={() => setIsNocModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Print Document Content */}
            <div className="bg-white p-6 space-y-6 text-[#0D2E45] print-area">
              {/* Header Letterhead */}
              <div className="flex items-start justify-between border-b-2 border-[#0D2E45] pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-[#0D2E45] text-white font-bold text-lg flex items-center justify-center">
                      M
                    </div>
                    <div>
                      <h2 className="text-xl font-bold tracking-tight text-[#0D2E45]">
                        MERALD GROUP ENTERPRISE
                      </h2>
                      <p className="text-[10px] text-gray-500 tracking-wider uppercase font-semibold">
                        EPC Contracting • Facility Management • Technical Manpower
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-right text-xs space-y-1">
                  <div className="font-mono font-bold text-[#3D9DA0]">
                    REF: {selectedNocRecord.nocReferenceNo}
                  </div>
                  <div className="text-gray-500 text-[11px]">
                    Date: {new Date(selectedNocRecord.nocIssuedDate || '2026-09-29').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* NOC Title */}
              <div className="text-center space-y-1 py-2">
                <h1 className="text-2xl font-extrabold uppercase tracking-widest text-[#0D2E45] border-b-2 border-teal-500 inline-block pb-1">
                  NO OBJECTION CERTIFICATE (NOC)
                </h1>
                <p className="text-xs text-gray-500 italic">To Whomsoever It May Concern</p>
              </div>

              {/* Certificate Body */}
              <div className="text-sm leading-relaxed text-gray-700 space-y-4 pt-2">
                <p>
                  This is to certify that <strong className="text-[#0D2E45]">{selectedNocRecord.employeeName}</strong> (Employee Code:{' '}
                  <strong className="font-mono text-[#3D9DA0]">{selectedNocRecord.employeeCode}</strong>), who was employed with Merald Group Enterprise in the capacity of{' '}
                  <strong className="text-[#0D2E45]">{selectedNocRecord.designation}</strong> under the <strong className="text-[#0D2E45]">{selectedNocRecord.department}</strong> department in{' '}
                  <strong>{selectedNocRecord.country}</strong>, has officially completed all exit clearance requirements on{' '}
                  <strong>{new Date(selectedNocRecord.lastWorkingDay).toLocaleDateString()}</strong>.
                </p>

                <p>
                  We confirm that the employee has returned all company property, equipment, access credentials, and safety gear. All financial dues, outstanding allowances, and gratuity obligations have been fully settled by the Accounts & Payroll department with zero remaining liabilities.
                </p>

                <p>
                  Merald Group Enterprise has <strong>NO OBJECTION</strong> to <strong className="text-[#0D2E45]">{selectedNocRecord.employeeName}</strong> seeking employment with any other organization or transferring their visa / work permit in accordance with local labor laws.
                </p>

                <p>
                  We express our sincere appreciation for their contributions during their tenure and wish them continued success in all future professional endeavors.
                </p>
              </div>

              {/* Clearance Department Sign-off Matrix */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-xs font-bold text-[#0D2E45] uppercase tracking-wider mb-2">
                  Verified Department Clearances:
                </h4>
                <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                  {selectedNocRecord.clearanceItems.map((item) => (
                    <div key={item.departmentKey} className="p-2 bg-gray-50 rounded-lg border border-gray-200">
                      <span className="block font-bold text-[#0D2E45]">{item.departmentName}</span>
                      <span className="text-emerald-600 font-semibold flex items-center justify-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3 h-3" /> CLEARED
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Official Seal & Signature */}
              <div className="pt-8 flex items-end justify-between">
                <div>
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#0D2E45] flex items-center justify-center text-center p-2 text-[9px] font-bold text-[#0D2E45] opacity-75">
                    MERALD GROUP
                    <br />
                    OFFICIAL CORPORATE
                    <br />
                    SEAL
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <div className="h-10 border-b border-gray-400 w-48 ml-auto flex items-end justify-end pb-1 font-serif italic text-xs text-gray-600">
                    Authorized Signatory
                  </div>
                  <div className="font-bold text-xs text-[#0D2E45]">Director of Human Resources</div>
                  <div className="text-[10px] text-gray-500">Merald Group Enterprise Global</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
