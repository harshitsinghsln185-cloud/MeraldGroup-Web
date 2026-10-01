import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
  FileText,
  RefreshCw,
  FileCheck,
  XCircle,
  Briefcase,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Heading, Text } from '../../components/ui/Typography';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ApplicantStatusModal, type ApplicantRecord } from '../../components/admin/ApplicantStatusModal';

export interface JobOption {
  _id: string;
  title: string;
}

export const Applicants: React.FC = () => {
  const { token, getModulePermission } = useAuth();

  const [applicants, setApplicants] = useState<ApplicantRecord[]>([]);
  const [vacancies, setVacancies] = useState<JobOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination State
  const [nameSearch, setNameSearch] = useState<string>('');
  const [passportSearch, setPassportSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [jobFilter, setJobFilter] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Modal State
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Document Loading State
  const [loadingDoc, setLoadingDoc] = useState<string | null>(null);

  const canWrite = getModulePermission('applicant_tracking') === 'FULL_ACCESS';

  // Fetch Published / All Vacancies for dropdown
  const fetchVacancies = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/admin/vacancies', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.data) {
        setVacancies(data.data.map((v: any) => ({ _id: v._id, title: v.title })));
      }
    } catch {
      // Fallback silently if vacancies call fails
    }
  }, [token]);

  // Fetch Applicants List
  const fetchApplicants = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let queryParams = new URLSearchParams();
      queryParams.append('page', String(page));
      queryParams.append('limit', '10');
      if (nameSearch.trim()) queryParams.append('name', nameSearch.trim());
      if (passportSearch.trim()) queryParams.append('passportNumber', passportSearch.trim());
      if (statusFilter) queryParams.append('status', statusFilter);
      if (jobFilter) queryParams.append('jobId', jobFilter);

      const res = await fetch(`/api/v1/admin/applicants?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to load applicants');
      }

      setApplicants(data.data || []);
      if (data.pagination) {
        setTotalPages(data.pagination.pages || 1);
        setTotalCount(data.pagination.total || 0);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching applicants.');
    } finally {
      setLoading(false);
    }
  }, [token, page, nameSearch, passportSearch, statusFilter, jobFilter]);

  useEffect(() => {
    fetchVacancies();
  }, [fetchVacancies]);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  const handleStatusUpdated = (updated: Partial<ApplicantRecord>) => {
    setApplicants((prev) =>
      prev.map((app) => (app._id === updated._id ? { ...app, ...updated } : app))
    );
  };

  // Track active blob URLs for unmount memory cleanup
  const activeBlobUrlsRef = React.useRef<string[]>([]);

  useEffect(() => {
    return () => {
      // Revoke any active blob URLs on component unmount
      activeBlobUrlsRef.current.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // Ignore if already revoked
        }
      });
      activeBlobUrlsRef.current = [];
    };
  }, []);

  // Securely stream and view candidate documents
  const handleViewDocument = async (applicantId: string, docType: 'passport' | 'resume') => {
    // 1. Open blank tab synchronously in direct click callstack to prevent popup blocker
    const newWindow = window.open('about:blank', '_blank');

    const docKey = `${applicantId}_${docType}`;
    setLoadingDoc(docKey);

    try {
      const res = await fetch(`/api/v1/admin/applicants/${applicantId}/document/${docType}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Failed to download document');
      }

      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      activeBlobUrlsRef.current.push(blobUrl);

      if (newWindow) {
        newWindow.location.href = blobUrl;
      } else {
        // Fallback for pop-up blocked browsers
        const link = document.createElement('a');
        link.href = blobUrl;
        link.target = '_blank';
        link.download = `${applicantId}_${docType}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // 2. Revoke object URL after 10 seconds to free memory after tab loads
      setTimeout(() => {
        try {
          URL.revokeObjectURL(blobUrl);
          activeBlobUrlsRef.current = activeBlobUrlsRef.current.filter((u) => u !== blobUrl);
        } catch {
          // Ignore error
        }
      }, 10000);
    } catch (err: any) {
      if (newWindow) {
        newWindow.close();
      }
      alert(err.message || 'Unable to open requested document.');
    } finally {
      setLoadingDoc(null);
    }
  };

  const getStatusBadgeVariant = (st: string): 'success' | 'teal' | 'danger' | 'warning' => {
    switch (st) {
      case 'HIRED':
        return 'success';
      case 'SHORTLISTED':
        return 'teal';
      case 'REJECTED':
        return 'danger';
      case 'NEW':
      default:
        return 'warning';
    }
  };

  return (
    <div className="space-y-6 font-body">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Heading level={1} color="navy" className="text-2xl font-bold flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-teal-600" />
            Applicant Tracking System (ATS)
          </Heading>
          <Text size="small" color="muted">
            Manage candidate submissions, review passport credentials, stream resumes, and update recruitment status.
          </Text>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchApplicants}
          className="self-start md:self-auto flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4 text-teal-600" />
          Refresh Candidates
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 bg-white border border-gray-200 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <Filter className="w-4 h-4 text-teal-600" />
          Filter & Search Applications ({totalCount} total)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Name Search */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Search Candidate Name</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={nameSearch}
                onChange={(e) => {
                  setNameSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 bg-[#F7F9FA] border border-gray-200 rounded-lg text-xs font-body focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Passport Search */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Passport Number</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="e.g. Z9876543"
                value={passportSearch}
                onChange={(e) => {
                  setPassportSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 bg-[#F7F9FA] border border-gray-200 rounded-lg text-xs font-body focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Application Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 bg-[#F7F9FA] border border-gray-200 rounded-lg text-xs font-body text-neutral-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="NEW">NEW</option>
              <option value="SHORTLISTED">SHORTLISTED</option>
              <option value="REJECTED">REJECTED</option>
              <option value="HIRED">HIRED</option>
            </select>
          </div>

          {/* Vacancy Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Job Vacancy Position</label>
            <select
              value={jobFilter}
              onChange={(e) => {
                setJobFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 bg-[#F7F9FA] border border-gray-200 rounded-lg text-xs font-body text-neutral-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              <option value="">All Job Openings</option>
              {vacancies.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Main Table Container */}
      <Card className="p-0 bg-white border border-gray-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 font-body text-sm">
            <RefreshCw className="w-8 h-8 animate-spin text-teal-600 mx-auto mb-2" />
            Loading job applications...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 font-body text-sm">
            <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            {error}
          </div>
        ) : applicants.length === 0 ? (
          <div className="p-12 text-center text-gray-500 font-body text-sm space-y-2">
            <FileText className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="font-semibold text-gray-700">No Applications Found</p>
            <p className="text-xs text-gray-400">
              Try adjusting your filter criteria or check back later when new candidates submit applications.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-body">
              <thead className="bg-[#0D2E45] text-white uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Candidate Name</th>
                  <th className="px-4 py-3">Passport No.</th>
                  <th className="px-4 py-3">Phone & Email</th>
                  <th className="px-4 py-3">Applied Job Title</th>
                  <th className="px-4 py-3">Applied Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Documents</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applicants.map((app) => (
                  <tr key={app._id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="px-4 py-3 font-medium text-navy-900">
                      <div className="font-semibold text-sm">{app.name}</div>
                      <div className="text-[11px] text-gray-500 font-normal">
                        Exp: {app.experienceYears} yrs • {app.country}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-navy-900 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                        {app.passportNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      <div className="text-teal-700 font-medium">{app.email}</div>
                      <div className="text-[11px] text-gray-500">{app.phone}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-navy-900">{app.jobTitle}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={getStatusBadgeVariant(app.status)}>
                        {app.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {/* Passport Icon Button */}
                        <button
                          onClick={() => handleViewDocument(app._id, 'passport')}
                          disabled={loadingDoc === `${app._id}_passport`}
                          className="px-2 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 text-[11px] font-semibold rounded border border-teal-200 flex items-center gap-1 transition-colors cursor-pointer"
                          title="View Passport Copy"
                        >
                          <FileCheck className="w-3.5 h-3.5 text-teal-600" />
                          <span>Passport</span>
                        </button>

                        {/* Resume Icon Button */}
                        <button
                          onClick={() => handleViewDocument(app._id, 'resume')}
                          disabled={loadingDoc === `${app._id}_resume`}
                          className="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-800 text-[11px] font-semibold rounded border border-purple-200 flex items-center gap-1 transition-colors cursor-pointer"
                          title="View Resume / CV"
                        >
                          <FileText className="w-3.5 h-3.5 text-purple-600" />
                          <span>Resume</span>
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedApplicant(app);
                          setIsModalOpen(true);
                        }}
                      >
                        {canWrite ? 'Review / Update' : 'View Details'}
                      </Button>
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
              <strong className="text-navy-900">{totalPages}</strong> ({totalCount} candidates)
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

      {/* Applicant Status Update Modal */}
      <ApplicantStatusModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedApplicant(null);
        }}
        applicant={selectedApplicant}
        onStatusUpdated={handleStatusUpdated}
        token={token}
      />
    </div>
  );
};

export default Applicants;
