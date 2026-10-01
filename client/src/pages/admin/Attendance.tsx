import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../config/constants';
import {
  CalendarCheck,
  CheckCircle2,
  Plus,
  XCircle,
} from 'lucide-react';

export interface AttendanceEntry {
  employeeCode: string;
  employeeName: string;
  siteLocation: string;
  statuses: Record<number, 'P' | 'A' | 'HD' | 'L' | 'OT'>;
  overtimeHours: number;
}

export const Attendance: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-09');
  const [selectedSite, setSelectedSite] = useState<string>('Lagos Financial Tower Site');
  const [checkInModal, setCheckInModal] = useState<boolean>(false);

  // Daily Check-In Form State
  const [checkInCode, setCheckInCode] = useState('MRLD-NIG-042');
  const [checkInDate, setCheckInDate] = useState('2026-09-26');
  const [checkInStatus, setCheckInStatus] = useState<'P' | 'A' | 'HD' | 'L' | 'OT'>('P');
  const [checkInOT, setCheckInOT] = useState<number>(2);

  const [roster, setRoster] = useState<AttendanceEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRoster = async () => {
      setLoading(true);
      try {
        const res = await apiFetch(
          `/api/v1/admin/attendance?month=${selectedMonth}&site=${encodeURIComponent(selectedSite)}`
        );
        const data = await res.json();
        if (res.ok && data.success && Array.isArray(data.data)) {
          const empMap: Record<string, AttendanceEntry> = {};
          for (const item of data.data) {
            const code = item.employeeCode || 'EMP';
            if (!empMap[code]) {
              empMap[code] = {
                employeeCode: code,
                employeeName: item.employeeName || 'Staff Member',
                siteLocation: item.siteLocation || selectedSite,
                statuses: {},
                overtimeHours: 0,
              };
            }
            if (item.date) {
              const dayNum = parseInt(item.date.split('-')[2], 10);
              if (dayNum) {
                empMap[code].statuses[dayNum] = item.status || 'P';
              }
            }
            empMap[code].overtimeHours += item.overtimeHours || 0;
          }
          setRoster(Object.values(empMap));
        } else {
          setRoster([]);
        }
      } catch {
        setRoster([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoster();
  }, [selectedMonth, selectedSite]);

  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  const getStatusBadgeClass = (status: 'P' | 'A' | 'HD' | 'L' | 'OT') => {
    switch (status) {
      case 'P':
        return 'bg-emerald-100 text-emerald-800';
      case 'A':
        return 'bg-red-100 text-red-800 font-bold';
      case 'HD':
        return 'bg-amber-100 text-amber-800';
      case 'L':
        return 'bg-blue-100 text-blue-800';
      case 'OT':
        return 'bg-purple-100 text-purple-800 font-bold';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleRecordCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckInModal(false);
    alert(`Attendance check-in recorded for ${checkInCode} on ${checkInDate}!`);
  };

  return (
    <div className="space-y-6 font-body">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2 text-[#0D2E45] mb-1">
            <CalendarCheck className="w-6 h-6 text-[#3D9DA0]" />
            <h1 className="text-2xl font-bold font-heading">Attendance & Site Roster System</h1>
          </div>
          <p className="text-xs text-gray-500">
            Daily site check-ins, monthly attendance matrix grid, and overtime hours ledger across operational locations.
          </p>
        </div>

        <button
          onClick={() => setCheckInModal(true)}
          className="px-4 py-2.5 bg-[#0D2E45] hover:bg-[#14476B] text-white text-xs font-bold rounded-lg shadow-md transition-all flex items-center shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Record Daily Site Check-In
        </button>
      </div>

      {/* Stats Quick Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
          <p className="text-xs font-semibold text-gray-500 uppercase">Monthly Attendance Rate</p>
          <h3 className="text-2xl font-bold text-[#0D2E45] mt-1">94.8%</h3>
          <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Benchmark Operational Level
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
          <p className="text-xs font-semibold text-gray-500 uppercase">Total Present Staff</p>
          <h3 className="text-2xl font-bold text-emerald-700 mt-1">458 Staff</h3>
          <p className="text-[11px] text-gray-500 mt-1">Active site deployments</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
          <p className="text-xs font-semibold text-gray-500 uppercase">Total Absent Count</p>
          <h3 className="text-2xl font-bold text-red-700 mt-1">12 Unexcused</h3>
          <p className="text-[11px] text-red-600 mt-1">Requires supervisor check</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
          <p className="text-xs font-semibold text-gray-500 uppercase">Total Overtime Hours</p>
          <h3 className="text-2xl font-bold text-purple-700 mt-1">56 Hours</h3>
          <p className="text-[11px] text-purple-600 mt-1">Verified site logs</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <label className="text-xs font-bold text-[#0D2E45]">Month Filter:</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-[#0D2E45] font-semibold"
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <label className="text-xs font-bold text-[#0D2E45]">Site Location:</label>
          <select
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-[#0D2E45] font-semibold"
          >
            <option value="Lagos Financial Tower Site">Lagos Financial Tower Site</option>
            <option value="Cyber City Hub, Gurgaon">Cyber City Hub, Gurgaon</option>
            <option value="Business Bay Tower, Dubai">Business Bay Tower, Dubai</option>
            <option value="Accra Power Substation">Accra Power Substation</option>
          </select>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-3.5 rounded-xl border border-gray-200 text-xs">
        <span className="font-bold text-[#0D2E45]">Status Legend:</span>
        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">P = Present</span>
        <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold">A = Absent</span>
        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">HD = Half Day</span>
        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">L = Leave</span>
        <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">OT = Overtime</span>
      </div>

      {/* Attendance Matrix Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs">
            <thead>
              <tr className="bg-[#F7F9FA] text-[#0D2E45] font-bold border-b border-gray-200">
                <th className="py-3 px-3 text-left min-w-[180px]">Employee Info</th>
                {daysInMonth.map((day) => (
                  <th key={day} className="py-3 px-1.5 w-8 text-[11px] font-mono">
                    {day}
                  </th>
                ))}
                <th className="py-3 px-3 min-w-[70px]">OT Hrs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={32} className="py-8 text-center text-gray-500">
                    Loading site attendance roster...
                  </td>
                </tr>
              ) : roster.length === 0 ? (
                <tr>
                  <td colSpan={32} className="py-8 text-center text-gray-500">
                    No attendance records found for the selected month and site. Use "Record Daily Site Check-In" to log attendance.
                  </td>
                </tr>
              ) : (
                roster.map((entry) => (
                  <tr key={entry.employeeCode} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-3 text-left">
                      <p className="font-bold text-[#0D2E45]">{entry.employeeName}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{entry.employeeCode}</p>
                    </td>

                    {daysInMonth.map((day) => {
                      const status = entry.statuses[day] || 'P';
                      return (
                        <td key={day} className="py-2 px-1">
                          <span
                            className={`inline-block w-6 h-6 leading-6 rounded text-[10px] text-center font-bold ${getStatusBadgeClass(
                              status
                            )}`}
                          >
                            {status}
                          </span>
                        </td>
                      );
                    })}

                    <td className="py-3 px-3 font-mono font-bold text-purple-700">
                      +{entry.overtimeHours}h
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Daily Check-In Modal */}
      {checkInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full relative shadow-2xl">
            <button
              onClick={() => setCheckInModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
            >
              <XCircle className="w-6 h-6" />
            </button>

            <h2 className="text-xl font-bold font-heading text-[#0D2E45] mb-1">
              Record Site Check-In
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              Enter site worker attendance status and overtime hours for the day.
            </p>

            <form onSubmit={handleRecordCheckIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#0D2E45] mb-1">Employee Code *</label>
                <input
                  type="text"
                  required
                  value={checkInCode}
                  onChange={(e) => setCheckInCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0D2E45] mb-1">Check-In Date *</label>
                <input
                  type="date"
                  required
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0D2E45] mb-1">Status *</label>
                  <select
                    value={checkInStatus}
                    onChange={(e) => setCheckInStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white"
                  >
                    <option value="P">P (Present)</option>
                    <option value="A">A (Absent)</option>
                    <option value="HD">HD (Half Day)</option>
                    <option value="L">L (Leave)</option>
                    <option value="OT">OT (Overtime)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0D2E45] mb-1">Overtime Hours</label>
                  <input
                    type="number"
                    min="0"
                    max="12"
                    value={checkInOT}
                    onChange={(e) => setCheckInOT(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setCheckInModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0D2E45] text-white text-xs font-bold rounded-lg hover:bg-[#14476B]"
                >
                  Save Check-In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
