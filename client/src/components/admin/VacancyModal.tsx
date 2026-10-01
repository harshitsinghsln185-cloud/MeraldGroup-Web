import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Heading, Text, Label } from '../ui/Typography';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { apiFetch } from '../../config/constants';

export interface JobVacancyRecord {
  _id?: string;
  title: string;
  department: string;
  salaryPackage: {
    amount: number;
    currency: 'INR' | 'NGN';
  };
  location: 'India' | 'UAE' | 'Uganda' | 'Nigeria' | 'Ghana';
  experienceRequired: string;
  ageRequirement: string;
  facilitiesProvided: string[];
  recruitmentProcess: { stepNumber: number; title: string; description: string }[];
  degreeRequired: string;
  skillsRequired: string[];
  documentsRequired: string[];
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';
  openingsCount: number;
  hiredCount?: number;
  closingDate?: string;
}

export interface VacancyModalProps {
  isOpen: boolean;
  onClose: () => void;
  vacancy: JobVacancyRecord | null;
  onSaved: () => void;
  token: string | null;
}

export const VacancyModal: React.FC<VacancyModalProps> = ({
  isOpen,
  onClose,
  vacancy,
  onSaved,
  token: _token,
}) => {
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('MEP');
  const [salaryAmount, setSalaryAmount] = useState<string>('500000');
  const [salaryCurrency, setSalaryCurrency] = useState<'INR' | 'NGN'>('INR');
  const [location, setLocation] = useState<'India' | 'UAE' | 'Uganda' | 'Nigeria' | 'Ghana'>('India');
  const [experienceRequired, setExperienceRequired] = useState('3-5 Years');
  const [ageRequirement, setAgeRequirement] = useState('22-35 Years');
  const [degreeRequired, setDegreeRequired] = useState('Bachelor of Engineering');
  const [openingsCount, setOpeningsCount] = useState<number>(1);
  const [closingDate, setClosingDate] = useState<string>('');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | 'CLOSED'>('DRAFT');

  const [facilitiesInput, setFacilitiesInput] = useState('Medical Insurance, Transport Allowance, Accommodation');
  const [skillsInput, setSkillsInput] = useState('MEP Design, AutoCAD, Site Supervision');
  const [docsInput, setDocsInput] = useState('Passport Copy, Degree Certificate, Experience Letter');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (vacancy) {
      setTitle(vacancy.title || '');
      setDepartment(vacancy.department || 'MEP');
      setSalaryAmount(String(vacancy.salaryPackage?.amount || 500000));
      setSalaryCurrency(vacancy.salaryPackage?.currency || 'INR');
      setLocation(vacancy.location || 'India');
      setExperienceRequired(vacancy.experienceRequired || '3-5 Years');
      setAgeRequirement(vacancy.ageRequirement || '22-35 Years');
      setDegreeRequired(vacancy.degreeRequired || 'Bachelor of Engineering');
      setOpeningsCount(vacancy.openingsCount || 1);
      setClosingDate(vacancy.closingDate ? vacancy.closingDate.split('T')[0] : '');
      setStatus(vacancy.status || 'DRAFT');

      setFacilitiesInput(vacancy.facilitiesProvided?.join(', ') || '');
      setSkillsInput(vacancy.skillsRequired?.join(', ') || '');
      setDocsInput(vacancy.documentsRequired?.join(', ') || '');
    } else {
      setTitle('');
      setDepartment('MEP');
      setSalaryAmount('500000');
      setSalaryCurrency('INR');
      setLocation('India');
      setExperienceRequired('3-5 Years');
      setAgeRequirement('22-35 Years');
      setDegreeRequired('Bachelor of Engineering');
      setOpeningsCount(1);
      setClosingDate('');
      setStatus('DRAFT');
      setFacilitiesInput('Medical Insurance, Transport Allowance, Accommodation');
      setSkillsInput('MEP Design, AutoCAD, Site Supervision');
      setDocsInput('Passport Copy, Degree Certificate, Experience Letter');
    }
    setError(null);
  }, [vacancy, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Job title is required');
      return;
    }

    const facilitiesProvided = facilitiesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const skillsRequired = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const documentsRequired = docsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title: title.trim(),
      department: department.trim(),
      salaryPackage: {
        amount: Number(salaryAmount),
        currency: salaryCurrency,
      },
      location,
      experienceRequired: experienceRequired.trim(),
      ageRequirement: ageRequirement.trim(),
      facilitiesProvided,
      recruitmentProcess: [
        { stepNumber: 1, title: 'CV Screening', description: 'HR Document Review' },
        { stepNumber: 2, title: 'Technical Interview', description: 'Engineering Panel Review' },
        { stepNumber: 3, title: 'Final Offer', description: 'Background & Passport Check' },
      ],
      degreeRequired: degreeRequired.trim(),
      skillsRequired,
      documentsRequired,
      openingsCount: Number(openingsCount),
      status,
      closingDate: closingDate ? new Date(closingDate).toISOString() : undefined,
    };

    setSaving(true);

    try {
      const isEdit = !!vacancy?._id;
      const url = isEdit ? `/api/v1/admin/vacancies/${vacancy._id}` : '/api/v1/admin/vacancies';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await apiFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to save job vacancy');
      }

      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving the vacancy');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto font-body"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl p-6 md:p-8 max-w-2xl w-full relative shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-6 pb-4 border-b border-gray-100">
          <Heading level={2} color="navy" className="text-xl sm:text-2xl mb-1">
            {vacancy?._id ? 'Edit Job Vacancy' : 'Create New Job Vacancy'}
          </Heading>
          <Text size="small" color="muted">
            Fill in position requirements, salary details, and recruitment specifications for the Career Portal.
          </Text>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-800 text-sm">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <p className="text-xs font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Job Title / Role"
            required
            placeholder="e.g. Senior MEP Engineer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label required>Department</Label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-body text-neutral-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="MEP">MEP Engineering</option>
                <option value="EPC">EPC Projects</option>
                <option value="IFM">IFM Facility Management</option>
                <option value="Logistics">Haulify Logistics</option>
                <option value="HR & Admin">HR & Admin</option>
                <option value="Accounts">Accounts & Finance</option>
              </select>
            </div>

            <div>
              <Label required>Location Country</Label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-body text-neutral-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="India">India 🇮🇳</option>
                <option value="Nigeria">Nigeria 🇳🇬</option>
                <option value="UAE">UAE 🇦🇪</option>
                <option value="Ghana">Ghana 🇬🇭</option>
                <option value="Uganda">Uganda 🇺🇬</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Salary Package Amount"
              type="number"
              required
              placeholder="e.g. 650000"
              value={salaryAmount}
              onChange={(e) => setSalaryAmount(e.target.value)}
            />
            <div>
              <Label required>Currency (INR / NGN Only)</Label>
              <select
                value={salaryCurrency}
                onChange={(e) => setSalaryCurrency(e.target.value as 'INR' | 'NGN')}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-body text-neutral-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="INR">INR (₹ Indian Rupee)</option>
                <option value="NGN">NGN (₦ Nigerian Naira)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Experience Required"
              required
              placeholder="e.g. 3-5 Years"
              value={experienceRequired}
              onChange={(e) => setExperienceRequired(e.target.value)}
            />
            <Input
              label="Age Requirement"
              required
              placeholder="e.g. 23-38 Years"
              value={ageRequirement}
              onChange={(e) => setAgeRequirement(e.target.value)}
            />
            <Input
              label="Degree / Qualification"
              required
              placeholder="e.g. B.Tech Electrical"
              value={degreeRequired}
              onChange={(e) => setDegreeRequired(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Openings Count"
              type="number"
              required
              min="1"
              value={openingsCount}
              onChange={(e) => setOpeningsCount(Number(e.target.value))}
            />
            <Input
              label="Closing Date (Optional)"
              type="date"
              value={closingDate}
              onChange={(e) => setClosingDate(e.target.value)}
            />
            <div>
              <Label required>Publish Status</Label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-body text-neutral-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="DRAFT">DRAFT (Internal)</option>
                <option value="PUBLISHED">PUBLISHED (Live on Site)</option>
                <option value="CLOSED">CLOSED (Inactive)</option>
              </select>
            </div>
          </div>

          <div>
            <Label>Facilities Provided (Comma-separated)</Label>
            <textarea
              rows={2}
              value={facilitiesInput}
              onChange={(e) => setFacilitiesInput(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-body focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <Label>Required Skills (Comma-separated)</Label>
            <textarea
              rows={2}
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-body focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <Label>Required Documents (Comma-separated)</Label>
            <textarea
              rows={2}
              value={docsInput}
              onChange={(e) => setDocsInput(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-body focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
            <Button variant="outline" size="md" type="button" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button variant="gradient" size="md" type="submit" isLoading={saving}>
              {vacancy?._id ? 'Update Vacancy' : 'Save & Create Vacancy'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VacancyModal;
