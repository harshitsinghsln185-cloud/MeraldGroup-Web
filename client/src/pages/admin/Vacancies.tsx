import React, { useState, useEffect, useCallback } from 'react';
import {
  Briefcase,
  Plus,
  Filter,
  RefreshCw,
  XCircle,
  FileText,
  Edit2,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Heading, Text } from '../../components/ui/Typography';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { VacancyModal, type JobVacancyRecord } from '../../components/admin/VacancyModal';

export const Vacancies: React.FC = () => {
  const { token, getModulePermission } = useAuth();

  const [vacancies, setVacancies] = useState<JobVacancyRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination State
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [deptFilter, setDeptFilter] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Modal State
  const [selectedVacancy, setSelectedVacancy] = useState<JobVacancyRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const canWrite = getModulePermission('applicant_tracking') === 'FULL_ACCESS';

  const fetchVacancies = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let queryParams = new URLSearchParams();
      queryParams.append('page', String(page));
      queryParams.append('limit', '10');
      if (statusFilter) queryParams.append('status', statusFilter);
      if (deptFilter) queryParams.append('department', deptFilter);
      if (locationFilter) queryParams.append('location', locationFilter);

      const res = await fetch(`/api/v1/admin/vacancies?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to load vacancies');
      }

      setVacancies(data.data || []);
      if (data.pagination) {
        setTotalPages(data.pagination.totalPages || 1);
        setTotalCount(data.pagination.total || 0);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching vacancies.');
    } finally {
      setLoading(false);
    }
  }, [token, page, statusFilter, deptFilter, locationFilter]);

  useEffect(() => {
    fetchVacancies();
  }, [fetchVacancies]);

  // Toggle publish / unpublish status
  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'PUBLISHED' ? 'CLOSED' : 'PUBLISHED';

    try {
      const res = await fetch(`/api/v1/admin/vacancies/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await res.json();
      if (!data.success) {
        alert(data.error?.message || 'Failed to update status');
        return;
      }

      fetchVacancies();
    } catch (err: any) {
      alert(err.message || 'Error updating status');
    }
  };

  // Delete vacancy
  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the vacancy "${title}"?`)) return;

    try {
      const res = await fetch(`/api/v1/admin/vacancies/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!data.success) {
        alert(data.error?.message || 'Failed to delete vacancy');
        return;
      }

      fetchVacancies();
    } catch (err: any) {
      alert(err.message || 'Error deleting vacancy');
    }
  };

  const getStatusBadgeVariant = (st: string): 'success' | 'teal' | 'danger' | 'warning' => {
    switch (st) {
      case 'PUBLISHED':
        return 'success';
      case 'CLOSED':
        return 'danger';
      case 'DRAFT':
      default:
        return 'warning';
    }
  };

  const getLocationFlag = (loc: string) => {
    switch (loc) {
      case 'India':
        return '🇮🇳';
      case 'Nigeria':
        return '🇳🇬';
      case 'UAE':
        return '🇦🇪';
      case 'Ghana':
        return '🇬🇭';
      case 'Uganda':
        return '🇺🇬';
      default:
        return '🌐';
    }
  };

  return (
    <div className="space-y-6 font-body">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Heading level={1} color="navy" className="text-2xl font-bold flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-teal-600" />
            Job Vacancy Management
          </Heading>
          <Text size="small" color="muted">
            Create, edit, publish, and manage job openings across Merald Group global branches.
          </Text>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchVacancies}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4 text-teal-600" />
            Refresh
          </Button>

          {canWrite && (
            <Button
              variant="gradient"
              size="sm"
              onClick={() => {
                setSelectedVacancy(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Vacancy
            </Button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 bg-white border border-gray-200 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <Filter className="w-4 h-4 text-teal-600" />
          Filter Vacancies ({totalCount} total)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Status Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 bg-[#F7F9FA] border border-gray-200 rounded-lg text-xs font-body text-neutral-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="DRAFT">DRAFT</option>
              <option value="PUBLISHED">PUBLISHED</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Department</label>
            <select
              value={deptFilter}
              onChange={(e) => {
                setDeptFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 bg-[#F7F9FA] border border-gray-200 rounded-lg text-xs font-body text-neutral-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              <option value="">All Departments</option>
              <option value="MEP">MEP Engineering</option>
              <option value="EPC">EPC Projects</option>
              <option value="IFM">IFM Facility Management</option>
              <option value="Logistics">Haulify Logistics</option>
              <option value="HR & Admin">HR & Admin</option>
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Country Location</label>
            <select
              value={locationFilter}
              onChange={(e) => {
                setLocationFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 bg-[#F7F9FA] border border-gray-200 rounded-lg text-xs font-body text-neutral-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              <option value="">All Countries</option>
              <option value="India">India 🇮🇳</option>
              <option value="Nigeria">Nigeria 🇳🇬</option>
              <option value="UAE">UAE 🇦🇪</option>
              <option value="Ghana">Ghana 🇬🇭</option>
              <option value="Uganda">Uganda 🇺🇬</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Main Table Container */}
      <Card className="p-0 bg-white border border-gray-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 font-body text-sm">
            <RefreshCw className="w-8 h-8 animate-spin text-teal-600 mx-auto mb-2" />
            Loading job vacancies...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 font-body text-sm">
            <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            {error}
          </div>
        ) : vacancies.length === 0 ? (
          <div className="p-12 text-center text-gray-500 font-body text-sm space-y-2">
            <FileText className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="font-semibold text-gray-700">No Vacancies Found</p>
            <p className="text-xs text-gray-400">
              Create a new vacancy using the button above to post job openings.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-body">
              <thead className="bg-[#0D2E45] text-white uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Job Title & Dept</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Salary Package</th>
                  <th className="px-4 py-3">Openings / Hired</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {vacancies.map((vac) => (
                  <tr key={vac._id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="px-4 py-3 font-medium text-navy-900">
                      <div className="font-semibold text-sm">{vac.title}</div>
                      <div className="text-[11px] text-teal-700 font-normal">{vac.department}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-800 flex items-center gap-1.5">
                        <span>{getLocationFlag(vac.location)}</span>
                        <span>{vac.location}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-teal-700">
                      {vac.salaryPackage?.currency === 'INR' ? '₹' : '₦'}
                      {vac.salaryPackage?.amount?.toLocaleString()}{' '}
                      <span className="text-[10px] text-gray-500">({vac.salaryPackage?.currency})</span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      <span className="font-bold text-navy-900">{vac.hiredCount || 0}</span> / {vac.openingsCount}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={getStatusBadgeVariant(vac.status)}>
                        {vac.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {canWrite && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedVacancy(vac);
                                setIsModalOpen(true);
                              }}
                              className="px-2 py-1"
                              title="Edit Vacancy"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>

                            <button
                              onClick={() => handleToggleStatus(vac._id!, vac.status)}
                              className={`px-2 py-1 text-[11px] font-semibold rounded border transition-colors cursor-pointer ${
                                vac.status === 'PUBLISHED'
                                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                              }`}
                              title={vac.status === 'PUBLISHED' ? 'Close Vacancy' : 'Publish Vacancy'}
                            >
                              {vac.status === 'PUBLISHED' ? 'Close' : 'Publish'}
                            </button>

                            <button
                              onClick={() => handleDelete(vac._id!, vac.title)}
                              className="p-1 bg-red-50 hover:bg-red-100 text-red-700 rounded border border-red-200 transition-colors cursor-pointer"
                              title="Delete Vacancy"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {!loading && totalPages > 1 && (
          <div className="p-4 bg-neutral-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600 font-body">
            <span>
              Page <strong className="text-navy-900">{page}</strong> of{' '}
              <strong className="text-navy-900">{totalPages}</strong> ({totalCount} vacancies)
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Vacancy Modal */}
      <VacancyModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedVacancy(null);
        }}
        vacancy={selectedVacancy}
        onSaved={fetchVacancies}
        token={token}
      />
    </div>
  );
};

export default Vacancies;
