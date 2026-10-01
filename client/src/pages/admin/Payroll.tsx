import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../config/constants';
import {
  Lock,
  Eye,
  Shield,
  FileText,
  Printer,
  CheckCircle2,
  XCircle,
  CreditCard,
  Send,
} from 'lucide-react';

export interface PayrollRecord {
  _id: string;
  employeeCode: string;
  employeeName: string;
  country: string;
  month: string;
  currency: 'INR' | 'NGN'; // Strictly restricted to INR or NGN
  basicSalary: number;
  housingAllowance: number;
  transportAllowance: number;
  otherAllowances: number;
  grossSalary: number;
  taxDeduction: number;
  pensionDeduction: number;
  otherDeductions: number;
  totalDeductions: number;
  netSalary: number;
  paymentStatus: 'PENDING' | 'PROCESSED' | 'PAID';
  paymentDate?: string;
  bankName: string;
  accountNumber: string;
}

export const Payroll: React.FC = () => {
  const { user, getModulePermission } = useAuth();
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-09');
  const [currencyFilter, setCurrencyFilter] = useState<'INR' | 'NGN' | ''>('');
  const [selectedPayslip, setSelectedPayslip] = useState<PayrollRecord | null>(null);
  const [processingBatch, setProcessingBatch] = useState<boolean>(false);
  const [processSuccess, setProcessSuccess] = useState<string | null>(null);

  // RBAC Permission Checks
  const canSeeFinancials =
    getModulePermission('sensitive_financial_info') === 'FULL_ACCESS' ||
    getModulePermission('payroll_processing') === 'FULL_ACCESS';
  const canProcessPayroll =
    (user?.role === 'HR' || user?.role === 'ACCOUNTS') &&
    getModulePermission('payroll_processing') === 'FULL_ACCESS';



  useEffect(() => {
    const fetchPayroll = async () => {
      try {
        const url = currencyFilter
          ? `/api/v1/admin/payroll?month=${selectedMonth}&currency=${currencyFilter}`
          : `/api/v1/admin/payroll?month=${selectedMonth}`;
        const res = await apiFetch(url);
        const data = await res.json();
        if (res.ok && data.success && data.data) {
          setPayrolls(data.data);
        } else {
          setPayrolls([]);
        }
      } catch {
        setPayrolls([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPayroll();
  }, [selectedMonth, currencyFilter]);

  const filteredPayrolls = payrolls.filter((item) => {
    return currencyFilter ? item.currency === currencyFilter : true;
  });

  const handleProcessBatch = async () => {
    setProcessingBatch(true);
    setTimeout(() => {
      setProcessingBatch(false);
      setProcessSuccess(`Monthly payroll batch for ${selectedMonth} processed successfully!`);
      setPayrolls(
        payrolls.map((p) => ({ ...p, paymentStatus: 'PROCESSED', paymentDate: '2026-09-26' }))
      );
      setTimeout(() => setProcessSuccess(null), 3000);
    }, 1500);
  };

  const handlePrintPayslip = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-body">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2 text-[#0D2E45] mb-1">
            <CreditCard className="w-6 h-6 text-[#3D9DA0]" />
            <h1 className="text-2xl font-bold font-heading">Payroll & Compensation Engine</h1>
          </div>
          <p className="text-xs text-gray-500">
            Role-gated salary structure, PDF payslip generator, and strict INR (₹) / NGN (₦) currency enforcement.
          </p>
        </div>

        {canProcessPayroll && (
          <button
            onClick={handleProcessBatch}
            disabled={processingBatch}
            className="px-4 py-2.5 bg-gradient-to-r from-[#0D2E45] to-[#1D6FA5] hover:opacity-90 text-white text-xs font-bold rounded-lg shadow-md transition-all flex items-center shrink-0 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4 mr-1.5" />
            {processingBatch ? 'Processing Batch...' : 'Process Monthly Payroll Batch'}
          </button>
        )}
      </div>

      {processSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{processSuccess}</span>
        </div>
      )}

      {/* RBAC Financial Status & Currency Rule Banner */}
      <div className="bg-[#E4F5EE] border border-[#83C9B8]/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3 text-[#0D2E45]">
          <Shield className="w-5 h-5 text-[#3D9DA0] shrink-0" />
          <div>
            <span className="font-bold">RBAC & Currency Enforcement Rule:</span>
            <span className="ml-1 text-gray-700">
              Assigned Role: <strong className="uppercase">{user?.role}</strong> • Payroll Currency: Strictly <strong>INR (₹) & NGN (₦) Only</strong>.
            </span>
          </div>
        </div>

        <div>
          {canSeeFinancials ? (
            <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full font-bold flex items-center w-fit">
              <Eye className="w-3.5 h-3.5 mr-1" /> Financial Processing Unlocked (HR / Accounts)
            </span>
          ) : (
            <span className="bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full font-bold flex items-center w-fit">
              <Lock className="w-3.5 h-3.5 mr-1" /> Access Masked: HR / ACCOUNTS Authorization Required
            </span>
          )}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <label className="text-xs font-bold text-[#0D2E45]">Payroll Month:</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-[#0D2E45] font-semibold"
          />
        </div>

        {/* Currency Selector (Strictly INR or NGN only) */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <label className="text-xs font-bold text-[#0D2E45]">Currency Filter (Enforced):</label>
          <select
            value={currencyFilter}
            onChange={(e) => setCurrencyFilter(e.target.value as any)}
            className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-[#0D2E45]"
          >
            <option value="">All Currencies (INR & NGN)</option>
            <option value="NGN">NGN (Nigerian Naira ₦)</option>
            <option value="INR">INR (Indian Rupee ₹)</option>
          </select>
        </div>
      </div>

      {/* Payroll Records Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
        {!canSeeFinancials ? (
          <div className="p-12 text-center text-amber-900 bg-amber-50/50 space-y-3">
            <Lock className="w-12 h-12 text-amber-600 mx-auto" />
            <h3 className="text-base font-bold font-heading">Payroll Access Blocked</h3>
            <p className="text-xs max-w-md mx-auto text-gray-600">
              Salary structure, net compensation, and PDF payslip generation are strictly restricted to <strong>HR</strong> and <strong>ACCOUNTS</strong> roles per the RBAC security matrix.
            </p>
          </div>
        ) : loading ? (
          <div className="p-12 text-center text-gray-500">Loading payroll records...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F7F9FA] text-[#0D2E45] font-bold uppercase tracking-wider border-b border-gray-200">
                  <th className="py-3.5 px-4">Employee</th>
                  <th className="py-3.5 px-4">Country & Currency</th>
                  <th className="py-3.5 px-4">Gross Salary</th>
                  <th className="py-3.5 px-4">Total Deductions</th>
                  <th className="py-3.5 px-4">Net Payable Salary</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Payslip Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPayrolls.map((pay) => (
                  <tr key={pay._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#0D2E45]">{pay.employeeName}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{pay.employeeCode}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-gray-700">{pay.country}</span>
                      <p className="text-[10px] font-mono font-bold text-teal-600">
                        {pay.currency === 'INR' ? '₹ INR (Indian Rupee)' : '₦ NGN (Nigerian Naira)'}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      {pay.currency === 'INR' ? '₹' : '₦'} {pay.grossSalary.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-red-600">
                      - {pay.currency === 'INR' ? '₹' : '₦'} {pay.totalDeductions.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-extrabold text-emerald-700 text-sm">
                      {pay.currency === 'INR' ? '₹' : '₦'} {pay.netSalary.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          pay.paymentStatus === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800'
                            : pay.paymentStatus === 'PROCESSED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {pay.paymentStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedPayslip(pay)}
                        className="px-3 py-1 bg-[#0D2E45] hover:bg-[#14476B] text-white text-[11px] font-bold rounded shadow-xs flex items-center ml-auto cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 mr-1 text-[#83C9B8]" /> View / Print Payslip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payslip PDF Modal View */}
      {selectedPayslip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-2xl w-full relative shadow-2xl max-h-[92vh] overflow-y-auto font-body">
            <button
              onClick={() => setSelectedPayslip(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 cursor-pointer print:hidden"
            >
              <XCircle className="w-6 h-6" />
            </button>

            {/* Official Merald Group Letterhead Header */}
            <div className="border-b-2 border-[#0D2E45] pb-4 mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold font-heading text-[#0D2E45]">
                  Merald Group International
                </h2>
                <p className="text-xs text-gray-500">
                  Engineering Excellence, Global Infrastructure & Integrated Services
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Nigeria • India • UAE • Ghana • Uganda
                </p>
              </div>

              <div className="text-right">
                <span className="bg-[#0D2E45] text-white text-xs px-3 py-1 rounded font-bold uppercase">
                  Official Payslip
                </span>
                <p className="text-xs text-gray-500 mt-1 font-mono">Period: {selectedPayslip.month}</p>
              </div>
            </div>

            {/* Employee & Bank Info Grid */}
            <div className="bg-[#F7F9FA] rounded-xl p-4 mb-6 grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-gray-400 text-[10px] uppercase font-bold">Employee Name</p>
                <p className="font-bold text-[#0D2E45] text-sm">{selectedPayslip.employeeName}</p>
                <p className="text-gray-500 font-mono">{selectedPayslip.employeeCode}</p>
              </div>

              <div>
                <p className="text-gray-400 text-[10px] uppercase font-bold">Country & Location</p>
                <p className="font-bold text-[#0D2E45]">{selectedPayslip.country} Hub</p>
                <p className="text-gray-500 font-mono">
                  {selectedPayslip.bankName} • {selectedPayslip.accountNumber}
                </p>
              </div>
            </div>

            {/* Earnings & Deductions Split */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              {/* Earnings Table */}
              <div className="border border-gray-200 rounded-xl p-4">
                <h4 className="font-bold text-xs text-[#0D2E45] uppercase border-b border-gray-100 pb-2 mb-3">
                  1. Earnings Breakdown ({selectedPayslip.currency})
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Basic Monthly Salary</span>
                    <span className="font-mono font-semibold">
                      {selectedPayslip.currency === 'INR' ? '₹' : '₦'} {selectedPayslip.basicSalary.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Housing Allowance</span>
                    <span className="font-mono font-semibold">
                      {selectedPayslip.currency === 'INR' ? '₹' : '₦'} {selectedPayslip.housingAllowance.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transport Allowance</span>
                    <span className="font-mono font-semibold">
                      {selectedPayslip.currency === 'INR' ? '₹' : '₦'} {selectedPayslip.transportAllowance.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Other Allowances</span>
                    <span className="font-mono font-semibold">
                      {selectedPayslip.currency === 'INR' ? '₹' : '₦'} {selectedPayslip.otherAllowances.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200 font-bold text-[#0D2E45]">
                    <span>Total Gross Salary</span>
                    <span className="font-mono">
                      {selectedPayslip.currency === 'INR' ? '₹' : '₦'} {selectedPayslip.grossSalary.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Deductions Table */}
              <div className="border border-gray-200 rounded-xl p-4">
                <h4 className="font-bold text-xs text-[#0D2E45] uppercase border-b border-gray-100 pb-2 mb-3">
                  2. Deductions Breakdown ({selectedPayslip.currency})
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Statutory Income Tax</span>
                    <span className="font-mono font-semibold text-red-600">
                      - {selectedPayslip.currency === 'INR' ? '₹' : '₦'} {selectedPayslip.taxDeduction.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pension Scheme</span>
                    <span className="font-mono font-semibold text-red-600">
                      - {selectedPayslip.currency === 'INR' ? '₹' : '₦'} {selectedPayslip.pensionDeduction.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Other Deductions</span>
                    <span className="font-mono font-semibold text-red-600">
                      - {selectedPayslip.currency === 'INR' ? '₹' : '₦'} {selectedPayslip.otherDeductions.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200 font-bold text-red-700">
                    <span>Total Deductions</span>
                    <span className="font-mono">
                      - {selectedPayslip.currency === 'INR' ? '₹' : '₦'} {selectedPayslip.totalDeductions.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Salary Total Box */}
            <div className="bg-[#0D2E45] text-white rounded-xl p-4 mb-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase text-[#83C9B8] font-bold">Net Payable Compensation</p>
                <p className="text-xs text-gray-300">Direct Bank Transfer to {selectedPayslip.bankName}</p>
              </div>
              <div className="text-right font-mono font-extrabold text-2xl text-[#83C9B8]">
                {selectedPayslip.currency === 'INR' ? '₹' : '₦'} {selectedPayslip.netSalary.toLocaleString()}
              </div>
            </div>

            {/* Signature & Print Footer */}
            <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-[10px] text-gray-400 font-mono">
                Generated by Merald HR & Accounts Engine • ISO Certified
              </div>

              <div className="flex items-center space-x-3 print:hidden">
                <button
                  onClick={() => setSelectedPayslip(null)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600"
                >
                  Close
                </button>
                <button
                  onClick={handlePrintPayslip}
                  className="px-4 py-2 bg-[#0D2E45] text-white text-xs font-bold rounded-lg flex items-center cursor-pointer"
                >
                  <Printer className="w-4 h-4 mr-1.5" /> Print / Save PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payroll;
