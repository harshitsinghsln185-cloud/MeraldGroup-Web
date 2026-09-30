import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  Search,
  Filter,
  Plus,
  FileText,
  Lock,
  Eye,
  AlertTriangle,
  MapPin,
  Shield,
  X,
} from 'lucide-react';
import { COUNTRIES } from '../../config/constants';

export interface IDocumentItem {
  documentType: string;
  documentNumber: string;
  expiryDate?: string;
  status: 'SAFE' | 'ATTENTION' | 'URGENT' | 'EXPIRED';
}

export interface EmployeeRecord {
  _id: string;
  employeeCode: string;
  fullName: string;
  email: string;
  phone: string;
  country: 'Nigeria' | 'India' | 'UAE' | 'Ghana' | 'Uganda';
  department: string;
  designation: string;
  siteLocation: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED' | 'ONBOARDING';
  joiningDate: string;
  avatar?: string;
  basicSalary?: number;
  currency?: string;
  bankName?: string;
  accountNumber?: string;
  taxPin?: string;
  documents: IDocumentItem[];
}

export const Employees: React.FC = () => {
  const { user, getModulePermission } = useAuth();
  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'docs' | 'financials'>('profile');

  // RBAC Permission Checks
  const canSeeFinancials = getModulePermission('sensitive_financial_info') === 'FULL_ACCESS';
  const canEditMasterData = getModulePermission('employee_master_data') === 'FULL_ACCESS';

  // Modal Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState<'Nigeria' | 'India' | 'UAE' | 'Ghana' | 'Uganda'>('Nigeria');
  const [department, setDepartment] = useState('MEP');
  const [designation, setDesignation] = useState('Senior MEP Engineer');
  const [siteLocation, setSiteLocation] = useState('Lagos Island Commercial Site');
  const [basicSalary, setBasicSalary] = useState<number>(350000);
  const [currency, setCurrency] = useState<'INR' | 'NGN'>('NGN');
  const [bankName, setBankName] = useState('First Bank of Nigeria');
  const [accountNumber, setAccountNumber] = useState('3084920194');
  const [taxPin, setTaxPin] = useState('NGN-TAX-884920');

  // Document Entry State
  const [docType, setDocType] = useState('Work Permit');
  const [docNum, setDocNum] = useState('WP-2026-9812');
  const [docExpiry, setDocExpiry] = useState('2026-10-15');



  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('merald_token');
        const res = await fetch('/api/v1/admin/employees', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.success && data.data) {
          setEmployees(data.data);
        } else {
          setEmployees([]);
        }
      } catch {
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter((emp) => {
    const matchSearch =
      emp.fullName.toLowerCase().includes(search.toLowerCase()) ||
      emp.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
      emp.designation.toLowerCase().includes(search.toLowerCase());
    const matchCountry = selectedCountry ? emp.country === selectedCountry : true;
    const matchDept = selectedDept ? emp.department === selectedDept : true;
    return matchSearch && matchCountry && matchDept;
  });

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    const newCode = `MRLD-${country.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const newEmp: EmployeeRecord = {
      _id: `emp-${Date.now()}`,
      employeeCode: newCode,
      fullName,
      email,
      phone,
      country,
      department,
      designation,
      siteLocation,
      status: 'ACTIVE',
      joiningDate: new Date().toISOString().split('T')[0],
      basicSalary,
      currency,
      bankName,
      accountNumber,
      taxPin,
      documents: [
        {
          documentType: docType,
          documentNumber: docNum,
          expiryDate: docExpiry,
          status: 'SAFE',
        },
      ],
    };

    setEmployees([newEmp, ...employees]);
    setModalOpen(false);
    // Reset form
    setFullName('');
    setEmail('');
    setPhone('');
  };

  return (
    <div className="space-y-6 font-body">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2 text-[#0D2E45] mb-1">
            <Users className="w-6 h-6 text-[#3D9DA0]" />
            <h1 className="text-2xl font-bold font-heading">Employees Master Data</h1>
          </div>
          <p className="text-xs text-gray-500">
            Central workforce registry, document expiry tracking, and role-gated financial records across 5 active nations.
          </p>
        </div>

        {canEditMasterData && (
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-[#0D2E45] to-[#1D6FA5] hover:opacity-90 text-white text-xs font-bold rounded-lg shadow-md transition-all flex items-center shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Provision New Employee
          </button>
        )}
      </div>

      {/* RBAC Financial Status Banner */}
      <div className="bg-[#E4F5EE] border border-[#83C9B8]/50 rounded-xl p-4 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-3 text-[#0D2E45]">
          <Shield className="w-5 h-5 text-[#3D9DA0]" />
          <div>
            <span className="font-bold">RBAC Permission Matrix Notice:</span>
            <span className="ml-1 text-gray-700">
              Logged in as <strong className="uppercase">{user?.role}</strong>.
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {canSeeFinancials ? (
            <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full font-bold flex items-center">
              <Eye className="w-3.5 h-3.5 mr-1" /> Financial Info Unlocked (HR / Accounts)
            </span>
          ) : (
            <span className="bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full font-bold flex items-center">
              <Lock className="w-3.5 h-3.5 mr-1" /> Basic Salary & Bank Details Masked
            </span>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by name, code, or designation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-[#1A1F24] focus:outline-none focus:ring-2 focus:ring-[#3D9DA0]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center text-xs font-semibold text-[#0D2E45]">
            <Filter className="w-4 h-4 mr-1 text-[#3D9DA0]" /> Filter:
          </div>

          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-[#1A1F24] focus:outline-none focus:ring-2 focus:ring-[#3D9DA0]"
          >
            <option value="">All Countries</option>
            {COUNTRIES.map((c) => (
              <option key={c.slug} value={c.name}>{c.flag} {c.name}</option>
            ))}
          </select>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-[#1A1F24] focus:outline-none focus:ring-2 focus:ring-[#3D9DA0]"
          >
            <option value="">All Departments</option>
            <option value="EPC">EPC</option>
            <option value="MEP">MEP</option>
            <option value="HVAC">HVAC</option>
            <option value="Facility Management">Facility Management</option>
            <option value="Logistics">Logistics</option>
            <option value="Corporate">Corporate</option>
          </select>
        </div>
      </div>

      {/* Employee Master Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 font-body">Loading employee records...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F7F9FA] text-[#0D2E45] font-bold uppercase tracking-wider border-b border-gray-200">
                  <th className="py-3.5 px-4">Employee</th>
                  <th className="py-3.5 px-4">Country & Site</th>
                  <th className="py-3.5 px-4">Department & Designation</th>
                  <th className="py-3.5 px-4">Doc Expiry Status</th>
                  <th className="py-3.5 px-4">Basic Salary / Financials</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEmployees.map((emp) => (
                  <tr key={emp._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={emp.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                          alt={emp.fullName}
                          className="w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-[#0D2E45]">{emp.fullName}</p>
                          <p className="text-[10px] text-gray-400 font-mono">{emp.employeeCode}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1 font-semibold text-[#0D2E45]">
                        <MapPin className="w-3.5 h-3.5 text-[#3D9DA0]" />
                        <span>{emp.country}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 truncate max-w-[180px]">{emp.siteLocation}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-block bg-blue-50 text-[#1D6FA5] font-semibold text-[10px] px-2 py-0.5 rounded border border-blue-100 mb-0.5">
                        {emp.department}
                      </span>
                      <p className="font-medium text-gray-700">{emp.designation}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      {emp.documents && emp.documents.length > 0 ? (
                        emp.documents.map((doc, i) => (
                          <div key={i} className="flex items-center space-x-1.5 mb-1 text-[11px]">
                            <FileText className="w-3.5 h-3.5 text-gray-400" />
                            <span className="font-medium">{doc.documentType}:</span>
                            <span
                              className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                doc.status === 'URGENT'
                                  ? 'bg-red-100 text-red-800 border border-red-200'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {doc.expiryDate}
                            </span>
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-400">No docs uploaded</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {canSeeFinancials ? (
                        <div>
                          <p className="font-mono font-bold text-emerald-700">
                            {emp.currency === 'INR' ? '₹' : '₦'} {emp.basicSalary?.toLocaleString() || '0'} / mo
                          </p>
                          <p className="text-[10px] text-gray-500 font-mono">
                            {emp.bankName} • {emp.accountNumber?.slice(-4).padStart(emp.accountNumber?.length || 8, '*')}
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 text-gray-400 font-mono">
                          <Lock className="w-3.5 h-3.5 text-amber-500" />
                          <span>*** (Masked)</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          emp.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : emp.status === 'ON_LEAVE'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Provision New Employee Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-2xl w-full relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-xl font-bold font-heading text-[#0D2E45] mb-1">
              Provision New Employee Master Record
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              Enter employee profile, legal document expiry info, and financial parameters.
            </p>

            {/* Modal Tabs */}
            <div className="flex items-center border-b border-gray-200 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`pb-2 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'profile' ? 'border-[#3D9DA0] text-[#0D2E45]' : 'border-transparent text-gray-400'
                }`}
              >
                1. General Profile
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('docs')}
                className={`pb-2 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'docs' ? 'border-[#3D9DA0] text-[#0D2E45]' : 'border-transparent text-gray-400'
                }`}
              >
                2. Legal Documents & Expiry
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('financials')}
                className={`pb-2 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'financials' ? 'border-[#3D9DA0] text-[#0D2E45]' : 'border-transparent text-gray-400'
                }`}
              >
                3. Financial & Salary (RBAC Gated)
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-4">
              {activeTab === 'profile' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#0D2E45] mb-1">Full Employee Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. David Okonjo"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0D2E45] mb-1">Business Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="david@meraldgroup.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#0D2E45] mb-1">Country *</label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value as any)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white"
                      >
                        <option value="Nigeria">Nigeria</option>
                        <option value="India">India</option>
                        <option value="UAE">UAE</option>
                        <option value="Ghana">Ghana</option>
                        <option value="Uganda">Uganda</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#0D2E45] mb-1">Department *</label>
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white"
                      >
                        <option value="MEP">MEP</option>
                        <option value="EPC">EPC</option>
                        <option value="HVAC">HVAC</option>
                        <option value="Facility Management">Facility Management</option>
                        <option value="Logistics">Logistics</option>
                        <option value="Corporate">Corporate</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#0D2E45] mb-1">Designation *</label>
                      <input
                        type="text"
                        required
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0D2E45] mb-1">Site / Project Location Assignment *</label>
                    <input
                      type="text"
                      required
                      value={siteLocation}
                      onChange={(e) => setSiteLocation(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'docs' && (
                <div className="space-y-4">
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-600 inline mr-1" />
                    Document expiry alerts will be triggered 30 days prior to expiry on the executive dashboard.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#0D2E45] mb-1">Document Type</label>
                      <select
                        value={docType}
                        onChange={(e) => setDocType(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white"
                      >
                        <option value="Work Permit">Work Permit</option>
                        <option value="Passport">Passport</option>
                        <option value="National ID / Tax PIN">National ID / Tax PIN</option>
                        <option value="HSE Certification">HSE Certification</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#0D2E45] mb-1">Document Number</label>
                      <input
                        type="text"
                        value={docNum}
                        onChange={(e) => setDocNum(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#0D2E45] mb-1">Expiry Date</label>
                      <input
                        type="date"
                        value={docExpiry}
                        onChange={(e) => setDocExpiry(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'financials' && (
                <div className="space-y-4">
                  {!canSeeFinancials ? (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center space-x-2">
                      <Lock className="w-5 h-5 text-amber-600 shrink-0" />
                      <span>Financial modification requires HR or ACCOUNTS user role per RBAC policy.</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#0D2E45] mb-1">Basic Monthly Salary</label>
                          <input
                            type="number"
                            value={basicSalary}
                            onChange={(e) => setBasicSalary(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#0D2E45] mb-1">Payroll Currency (INR or NGN only)</label>
                          <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value as any)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white"
                          >
                            <option value="NGN">NGN (Nigerian Naira ₦)</option>
                            <option value="INR">INR (Indian Rupee ₹)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#0D2E45] mb-1">Bank Name</label>
                          <input
                            type="text"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#0D2E45] mb-1">Account Number</label>
                          <input
                            type="text"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#0D2E45] mb-1">Tax PIN / ID</label>
                          <input
                            type="text"
                            value={taxPin}
                            onChange={(e) => setTaxPin(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0D2E45] text-white text-xs font-bold rounded-lg hover:bg-[#14476B]"
                >
                  Save Employee Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
