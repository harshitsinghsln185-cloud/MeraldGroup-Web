import React, { useEffect, useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Filter,
  Users,
  CreditCard,
  BarChart3,
  ShieldAlert,
  Printer,
} from 'lucide-react';
import { COUNTRIES } from '../../config/constants';

export const Reports: React.FC = () => {
  const [reportType, setReportType] = useState<'EMPLOYEE' | 'PAYROLL' | 'MANPOWER' | 'AUDIT'>('EMPLOYEE');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-09');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('NGN');
  const [reportData, setReportData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchReportData = React.useCallback(async () => {
    try {
      let url = `/api/v1/admin/reports/summary?type=${reportType}&`;
      if (selectedCountry) url += `country=${selectedCountry}&`;
      if (selectedMonth) url += `month=${selectedMonth}&`;
      if (selectedCurrency) url += `currency=${selectedCurrency}&`;

      const res = await fetch(url, { credentials: 'include' });
      const data = await res.json();
      if (data.success && data.data) {
        setReportData(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch report summary:', err);
    } finally {
      setLoading(false);
    }
  }, [reportType, selectedCountry, selectedMonth, selectedCurrency]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  const handleExportCSV = () => {
    if (reportData.length === 0) return;
    const headers = Object.keys(reportData[0]).join(',');
    const rows = reportData.map((row) =>
      Object.values(row)
        .map((val) => `"${String(val).replace(/"/g, '""')}"`)
        .join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Merald_Group_${reportType}_Report_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-[#0D2E45] space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-[#3D9DA0] tracking-wider uppercase">
              Phase 5 Reporting Suite
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0D2E45] mt-1 flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-[#3D9DA0]" />
            HR & Operational Analytics Suite
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Export filterable operational and financial PDF & Excel/CSV reports across global sites.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 text-white text-xs font-semibold rounded-xl hover:bg-emerald-800 transition-colors shadow-2xs"
          >
            <Download className="w-4 h-4" />
            Export Excel / CSV
          </button>
          <button
            onClick={handlePrintPDF}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0D2E45] text-white text-xs font-semibold rounded-xl hover:bg-[#163f5c] transition-colors shadow-2xs"
          >
            <Printer className="w-4 h-4" />
            Print PDF Report
          </button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => setReportType('EMPLOYEE')}
          className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
            reportType === 'EMPLOYEE'
              ? 'bg-[#0D2E45] text-white border-[#0D2E45] shadow-md'
              : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
          }`}
        >
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">Master Report</span>
            <div className="text-sm font-bold mt-0.5 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Employee Directory
            </div>
          </div>
        </button>

        <button
          onClick={() => setReportType('PAYROLL')}
          className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
            reportType === 'PAYROLL'
              ? 'bg-[#0D2E45] text-white border-[#0D2E45] shadow-md'
              : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
          }`}
        >
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">Financials (INR/NGN)</span>
            <div className="text-sm font-bold mt-0.5 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Payroll Summary
            </div>
          </div>
        </button>

        <button
          onClick={() => setReportType('MANPOWER')}
          className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
            reportType === 'MANPOWER'
              ? 'bg-[#0D2E45] text-white border-[#0D2E45] shadow-md'
              : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
          }`}
        >
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">Site Metrics</span>
            <div className="text-sm font-bold mt-0.5 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Manpower Shortfalls
            </div>
          </div>
        </button>

        <button
          onClick={() => setReportType('AUDIT')}
          className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
            reportType === 'AUDIT'
              ? 'bg-[#0D2E45] text-white border-[#0D2E45] shadow-md'
              : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
          }`}
        >
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">Compliance Log</span>
            <div className="text-sm font-bold mt-0.5 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              Audit Trail Log
            </div>
          </div>
        </button>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-2xs flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
            <Filter className="w-4 h-4 text-[#3D9DA0]" />
            Report Filters:
          </div>

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

          {reportType === 'PAYROLL' && (
            <>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 bg-gray-50 focus:outline-hidden focus:border-[#3D9DA0]"
              />

              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="text-xs border border-gray-200 rounded-lg px-3 py-2 text-gray-700 bg-gray-50 focus:outline-hidden focus:border-[#3D9DA0]"
              >
                <option value="NGN">NGN (₦) Currency</option>
                <option value="INR">INR (₹) Currency</option>
              </select>
            </>
          )}
        </div>

        <div className="text-xs text-gray-500 font-medium">
          Total Records: <span className="font-bold text-[#0D2E45]">{reportData.length}</span>
        </div>
      </div>

      {/* Report Data Table View */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-400">Compiling report dataset...</div>
        ) : reportData.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-400">
            No records matched the selected report criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0D2E45] text-white uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  {Object.keys(reportData[0])
                    .filter((key) => key !== '_id' && key !== '__v' && key !== 'documents' && key !== 'clearanceItems')
                    .map((header) => (
                      <th key={header} className="px-4 py-3">
                        {header.replace(/([A-Z])/g, ' $1').trim()}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {reportData.map((row, idx) => (
                  <tr key={row._id || idx} className="hover:bg-teal-50/30 transition-colors">
                    {Object.entries(row)
                      .filter(([key]) => key !== '_id' && key !== '__v' && key !== 'documents' && key !== 'clearanceItems')
                      .map(([_key, val]: [string, any], colIdx) => (
                        <td key={colIdx} className="px-4 py-3 font-mono text-[11px]">
                          {typeof val === 'number'
                            ? val.toLocaleString()
                            : val instanceof Date || (typeof val === 'string' && val.includes('T00:00'))
                            ? new Date(val).toLocaleDateString()
                            : String(val)}
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
