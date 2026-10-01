import React, { useState, useEffect } from 'react';
import { X, AlertCircle, User, Briefcase, MapPin } from 'lucide-react';
import { Heading, Text, Label } from '../ui/Typography';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

export interface ApplicantRecord {
  _id: string;
  jobId: string;
  jobTitle: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  whatsAppNumber?: string;
  country: string;
  state: string;
  city: string;
  passportNumber: string;
  experienceYears: number;
  previousCompany: string;
  previousRole: string;
  previousCTC: {
    amount: number;
    currency: 'INR' | 'NGN';
  };
  status: 'NEW' | 'SHORTLISTED' | 'REJECTED' | 'HIRED';
  notes?: string;
  appliedAt: string;
}

export interface ApplicantStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicant: ApplicantRecord | null;
  onStatusUpdated: (updatedApplicant: Partial<ApplicantRecord>) => void;
  token: string | null;
}

export const ApplicantStatusModal: React.FC<ApplicantStatusModalProps> = ({
  isOpen,
  onClose,
  applicant,
  onStatusUpdated,
  token,
}) => {
  const [status, setStatus] = useState<'NEW' | 'SHORTLISTED' | 'REJECTED' | 'HIRED'>('NEW');
  const [notes, setNotes] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (applicant) {
      setStatus(applicant.status || 'NEW');
      setNotes(applicant.notes || '');
      setError(null);
    }
  }, [applicant]);

  if (!isOpen || !applicant) return null;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const res = await fetch(`/api/v1/admin/applicants/${applicant._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, notes }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to update status');
      }

      onStatusUpdated({
        _id: applicant._id,
        status,
        notes,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating status');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl p-6 md:p-8 max-w-2xl w-full relative shadow-2xl my-8 max-h-[90vh] overflow-y-auto font-body">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 pb-4 border-b border-gray-100 flex items-start justify-between pr-8">
          <div>
            <div className="flex items-center gap-3">
              <Heading level={2} color="navy" className="text-xl sm:text-2xl mb-0">
                {applicant.name}
              </Heading>
              <Badge variant={getStatusBadgeVariant(applicant.status)}>
                {applicant.status}
              </Badge>
            </div>
            <Text size="small" color="muted" className="mt-1">
              Applied for <span className="font-semibold text-teal-700">{applicant.jobTitle}</span> on{' '}
              {new Date(applicant.appliedAt).toLocaleDateString()}
            </Text>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-800 text-sm font-body">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <p className="text-xs font-medium">{error}</p>
          </div>
        )}

        {/* Candidate Details Grid */}
        <div className="space-y-4 mb-6">
          {/* Personal Info */}
          <Card className="p-4 bg-neutral-50/60 border border-gray-200 space-y-2">
            <div className="flex items-center gap-2 pb-1 border-b border-gray-200">
              <User className="w-4 h-4 text-teal-600" />
              <p className="text-xs font-bold text-navy-900 uppercase tracking-wider">Contact Information</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Email:</span>{' '}
                <a href={`mailto:${applicant.email}`} className="font-semibold text-teal-700 hover:underline">
                  {applicant.email}
                </a>
              </div>
              <div>
                <span className="text-gray-500">Phone:</span>{' '}
                <span className="font-semibold text-neutral-800">{applicant.phone}</span>
              </div>
              {applicant.whatsAppNumber && (
                <div>
                  <span className="text-gray-500">WhatsApp:</span>{' '}
                  <span className="font-semibold text-neutral-800">{applicant.whatsAppNumber}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Residence & Passport */}
          <Card className="p-4 bg-neutral-50/60 border border-gray-200 space-y-2">
            <div className="flex items-center gap-2 pb-1 border-b border-gray-200">
              <MapPin className="w-4 h-4 text-teal-600" />
              <p className="text-xs font-bold text-navy-900 uppercase tracking-wider">Location & Passport</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Residence:</span>{' '}
                <span className="font-semibold text-neutral-800">
                  {applicant.city}, {applicant.state}, {applicant.country}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Passport Number:</span>{' '}
                <span className="font-mono font-bold text-navy-900 bg-white px-2 py-0.5 rounded border border-gray-200">
                  {applicant.passportNumber}
                </span>
              </div>
            </div>
          </Card>

          {/* Experience & Salary */}
          <Card className="p-4 bg-neutral-50/60 border border-gray-200 space-y-2">
            <div className="flex items-center gap-2 pb-1 border-b border-gray-200">
              <Briefcase className="w-4 h-4 text-teal-600" />
              <p className="text-xs font-bold text-navy-900 uppercase tracking-wider">Work History & Compensation</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Total Experience:</span>{' '}
                <span className="font-semibold text-neutral-800">{applicant.experienceYears} Years</span>
              </div>
              <div>
                <span className="text-gray-500">Previous Company:</span>{' '}
                <span className="font-semibold text-neutral-800">{applicant.previousCompany}</span>
              </div>
              <div>
                <span className="text-gray-500">Previous Role:</span>{' '}
                <span className="font-semibold text-neutral-800">{applicant.previousRole}</span>
              </div>
              <div>
                <span className="text-gray-500">Previous CTC:</span>{' '}
                <span className="font-bold text-teal-700">
                  {applicant.previousCTC?.currency === 'INR' ? '₹' : '₦'}
                  {applicant.previousCTC?.amount?.toLocaleString()}{' '}
                  <span className="text-[10px] text-gray-500">({applicant.previousCTC?.currency})</span>
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Status & Notes Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-gray-200">
          <div>
            <Label required>Update Candidate Status</Label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-body text-neutral-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              <option value="NEW">NEW — Initial Application Received</option>
              <option value="SHORTLISTED">SHORTLISTED — Qualified for Interview</option>
              <option value="REJECTED">REJECTED — Application Closed / Disqualified</option>
              <option value="HIRED">HIRED — Candidate Selected & Hired</option>
            </select>
          </div>

          <div>
            <Label>HR Review Notes / Interview Feedback</Label>
            <textarea
              rows={3}
              placeholder="Add internal feedback, interview outcome, or notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-body text-neutral-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
            <Button variant="outline" size="md" type="button" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button variant="gradient" size="md" type="submit" isLoading={saving}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicantStatusModal;
