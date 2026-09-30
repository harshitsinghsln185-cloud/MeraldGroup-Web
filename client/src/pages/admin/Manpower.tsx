import React, { useEffect, useState } from 'react';
import {
  Users,
  AlertTriangle,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { COUNTRIES } from '../../config/constants';

export interface ManpowerRow {
  _id: string;
  siteName: string;
  country: 'Nigeria' | 'India' | 'UAE' | 'Ghana' | 'Uganda';
  tradeCategory: 'MEP Engineers' | 'HVAC Technicians' | 'HSE Inspectors' | 'Logistics Drivers' | 'General Labor';
  contractedHeadcount: number;
  actualDeployedHeadcount: number;
  shortfall: number;
  fulfillmentRate: number;
  status: 'OPTIMAL' | 'SHORTFALL' | 'CRITICAL';
}

export const Manpower: React.FC = () => {
  const [items, setItems] = useState<ManpowerRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [countryFilter, setCountryFilter] = useState<string>('');
  const [tradeFilter, setTradeFilter] = useState<string>('');



  useEffect(() => {
    const fetchManpower = async () => {
      try {
        const token = localStorage.getItem('merald_token');
        const res = await fetch('/api/v1/admin/manpower', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.success && data.data) {
          setItems(data.data);
        } else {
          setItems([]);
        }
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchManpower();
  }, []);

  const filteredItems = items.filter((row) => {
    const matchCountry = countryFilter ? row.country === countryFilter : true;
    const matchTrade = tradeFilter ? row.tradeCategory === tradeFilter : true;
    return matchCountry && matchTrade;
  });

  // Calculate totals
  let totalContracted = 0;
  let totalDeployed = 0;
  let totalShortfall = 0;

  filteredItems.forEach((r) => {
    totalContracted += r.contractedHeadcount;
    totalDeployed += r.actualDeployedHeadcount;
    totalShortfall += r.shortfall;
  });

  const overallFulfillment = totalContracted > 0 ? Math.round((totalDeployed / totalContracted) * 100) : 100;

  return (
    <div className="space-y-6 font-body">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2 text-[#0D2E45] mb-1">
            <Users className="w-6 h-6 text-[#3D9DA0]" />
            <h1 className="text-2xl font-bold font-heading">Manpower Supply Analytics</h1>
          </div>
          <p className="text-xs text-gray-500">
            Contracted vs. actual site deployment tracking, shortfall warning matrices, and trade fulfillment metrics.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
          <p className="text-xs font-semibold text-gray-500 uppercase">Contracted Headcount</p>
          <h3 className="text-2xl font-bold text-[#0D2E45] mt-1">{totalContracted} Workers</h3>
          <p className="text-[11px] text-gray-500 mt-1">Per active client agreements</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
          <p className="text-xs font-semibold text-gray-500 uppercase">Actual Deployed Staff</p>
          <h3 className="text-2xl font-bold text-emerald-700 mt-1">{totalDeployed} Staff</h3>
          <p className="text-[11px] text-emerald-600 mt-1 flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Active on site
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-red-200 bg-red-50/30 shadow-2xs">
          <p className="text-xs font-semibold text-red-800 uppercase">Manpower Shortfall</p>
          <h3 className="text-2xl font-bold text-red-700 mt-1">-{totalShortfall} Shortfall</h3>
          <p className="text-[11px] text-red-600 mt-1 flex items-center">
            <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Urgent recruitment needed
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
          <p className="text-xs font-semibold text-gray-500 uppercase">Deployment Fulfillment Rate</p>
          <h3 className="text-2xl font-bold text-[#3D9DA0] mt-1">{overallFulfillment}%</h3>
          <p className="text-[11px] text-gray-500 mt-1">Overall fulfillment SLA</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-xs font-semibold text-[#0D2E45]">
          <Filter className="w-4 h-4 text-[#3D9DA0]" />
          <span>Filter Matrix:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-body text-[#0D2E45]"
          >
            <option value="">All Countries</option>
            {COUNTRIES.map((c) => (
              <option key={c.slug} value={c.name}>{c.flag} {c.name}</option>
            ))}
          </select>

          <select
            value={tradeFilter}
            onChange={(e) => setTradeFilter(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-body text-[#0D2E45]"
          >
            <option value="">All Trade Specialties</option>
            <option value="MEP Engineers">MEP Engineers</option>
            <option value="HVAC Technicians">HVAC Technicians</option>
            <option value="HSE Inspectors">HSE Inspectors</option>
            <option value="Logistics Drivers">Logistics Drivers</option>
            <option value="General Labor">General Labor</option>
          </select>
        </div>
      </div>

      {/* Contracted vs Deployed Matrix Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading manpower analytics...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F7F9FA] text-[#0D2E45] font-bold uppercase tracking-wider border-b border-gray-200">
                  <th className="py-3.5 px-4">Site Location & Country</th>
                  <th className="py-3.5 px-4">Trade Specialty</th>
                  <th className="py-3.5 px-4">Contracted vs Deployed</th>
                  <th className="py-3.5 px-4">Shortfall</th>
                  <th className="py-3.5 px-4">Fulfillment Rate</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredItems.map((row) => (
                  <tr key={row._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#0D2E45]">{row.siteName}</p>
                      <p className="text-[10px] text-[#3D9DA0] font-semibold">{row.country} Hub</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded font-bold text-[10px] bg-blue-50 text-[#1D6FA5] border border-blue-100">
                        {row.tradeCategory}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <span className="text-gray-500">{row.contractedHeadcount} Req</span>
                      <span className="mx-1">/</span>
                      <span className="font-bold text-[#0D2E45]">{row.actualDeployedHeadcount} Deployed</span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold">
                      {row.shortfall > 0 ? (
                        <span className="text-red-600">-{row.shortfall} Workers</span>
                      ) : (
                        <span className="text-emerald-600">0 (Fulfilled)</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              row.fulfillmentRate >= 95
                                ? 'bg-emerald-500'
                                : row.fulfillmentRate >= 85
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(row.fulfillmentRate, 100)}%` }}
                          />
                        </div>
                        <span className="font-bold font-mono text-gray-700">{row.fulfillmentRate}%</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          row.status === 'OPTIMAL'
                            ? 'bg-emerald-100 text-emerald-800'
                            : row.status === 'SHORTFALL'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
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

export default Manpower;
