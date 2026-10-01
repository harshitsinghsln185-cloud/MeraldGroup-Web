import React, { useState } from 'react';
import axios from 'axios';
import {
  X,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Briefcase,
  User,
  MapPin,
} from 'lucide-react';
import { Heading, Text, Label } from '../ui/Typography';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { API_BASE_URL } from '../../config/constants';

export interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
}

export const JobApplicationModal: React.FC<JobApplicationModalProps> = ({
  isOpen,
  onClose,
  jobId,
  jobTitle,
}) => {
  // Personal Info
  const [firstName, setFirstName] = useState<string>('');
  const [middleName, setMiddleName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [whatsAppNumber, setWhatsAppNumber] = useState<string>('');

  // Location & Passport
  const [country, setCountry] = useState<string>('India');
  const [stateName, setStateName] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [passportNumber, setPassportNumber] = useState<string>('');

  // Work & Salary Info
  const [experienceYears, setExperienceYears] = useState<string>('3');
  const [previousCompany, setPreviousCompany] = useState<string>('');
  const [previousRole, setPreviousRole] = useState<string>('');
  const [previousCTCAmount, setPreviousCTCAmount] = useState<string>('');
  const [previousCTCCurrency, setPreviousCTCCurrency] = useState<'INR' | 'NGN'>('INR');

  // Files
  const [passportFile, setPassportFile] = useState<File | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // Status & Errors
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePassportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFieldErrors((prev) => ({ ...prev, passportFile: '' }));

    if (!file) {
      setPassportFile(null);
      return;
    }

    const ext = file.name.split('.').pop()?.toLowerCase();
    const allowed = ['pdf', 'png', 'jpg', 'jpeg'];
    if (!ext || !allowed.includes(ext)) {
      setFieldErrors((prev) => ({
        ...prev,
        passportFile: 'Invalid file type. Passport document must be PDF, PNG, or JPG.',
      }));
      setPassportFile(null);
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFieldErrors((prev) => ({
        ...prev,
        passportFile: 'File exceeds 5MB limit. Please upload a smaller file.',
      }));
      setPassportFile(null);
      e.target.value = '';
      return;
    }

    setPassportFile(file);
  };

  const handleResumeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFieldErrors((prev) => ({ ...prev, resumeFile: '' }));

    if (!file) {
      setResumeFile(null);
      return;
    }

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'doc') {
      setFieldErrors((prev) => ({
        ...prev,
        resumeFile: 'Legacy .doc files are not supported. Please upload a .pdf or .docx file.',
      }));
      setResumeFile(null);
      e.target.value = '';
      return;
    }

    const allowed = ['pdf', 'docx'];
    if (!ext || !allowed.includes(ext)) {
      setFieldErrors((prev) => ({
        ...prev,
        resumeFile: 'Invalid file format. Resume must be a PDF or DOCX file.',
      }));
      setResumeFile(null);
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFieldErrors((prev) => ({
        ...prev,
        resumeFile: 'File exceeds 5MB limit. Please upload a smaller file.',
      }));
      setResumeFile(null);
      e.target.value = '';
      return;
    }

    setResumeFile(file);
  };

  const validateClientSide = (): boolean => {
    const errors: Record<string, string> = {};

    if (!firstName.trim() || firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }
    if (!lastName.trim() || lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please provide a valid email address';
    }
    if (!phone.trim() || phone.trim().length < 7) {
      errors.phone = 'Phone number must be at least 7 characters';
    }
    if (!country.trim()) errors.country = 'Country is required';
    if (!stateName.trim()) errors.stateName = 'State is required';
    if (!city.trim()) errors.city = 'City is required';

    const passportUpper = passportNumber.trim().toUpperCase();
    if (!passportUpper || !/^[A-Z0-9]{6,12}$/.test(passportUpper)) {
      errors.passportNumber = 'Passport number must be 6-12 alphanumeric characters (e.g. Z9876543)';
    }

    if (experienceYears === '' || Number(experienceYears) < 0) {
      errors.experienceYears = 'Experience years must be 0 or greater';
    }
    if (!previousCompany.trim() || previousCompany.trim().length < 2) {
      errors.previousCompany = 'Previous company is required';
    }
    if (!previousRole.trim() || previousRole.trim().length < 2) {
      errors.previousRole = 'Previous role is required';
    }
    if (previousCTCAmount === '' || Number(previousCTCAmount) < 0) {
      errors.previousCTCAmount = 'Previous CTC amount is required';
    }

    if (!passportFile) {
      errors.passportFile = 'Passport document is required';
    }
    if (!resumeFile) {
      errors.resumeFile = 'Resume document is required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateClientSide()) {
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('jobId', jobId);
      formData.append('firstName', firstName.trim());
      if (middleName.trim()) formData.append('middleName', middleName.trim());
      formData.append('lastName', lastName.trim());
      formData.append('email', email.trim().toLowerCase());
      formData.append('phone', phone.trim());
      if (whatsAppNumber.trim()) formData.append('whatsAppNumber', whatsAppNumber.trim());

      formData.append('country', country.trim());
      formData.append('state', stateName.trim());
      formData.append('city', city.trim());
      formData.append('passportNumber', passportNumber.trim().toUpperCase());

      formData.append('experienceYears', String(Number(experienceYears)));
      formData.append('previousCompany', previousCompany.trim());
      formData.append('previousRole', previousRole.trim());

      const ctcPayload = {
        amount: Number(previousCTCAmount),
        currency: previousCTCCurrency,
      };
      formData.append('previousCTC', JSON.stringify(ctcPayload));

      if (passportFile) formData.append('passportFile', passportFile);
      if (resumeFile) formData.append('resumeFile', resumeFile);

      const response = await axios.post(`${API_BASE_URL}/jobs/apply`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        setSuccessMessage('Your application has been submitted successfully! Check your email for confirmation.');
      }
    } catch (err: any) {
      if (err.response) {
        const errorData = err.response.data?.error;
        if (err.response.status === 429) {
          setErrorMessage('Too many attempts. Please try submitting again in an hour.');
        } else if (errorData?.code === 'DUPLICATE_APPLICATION') {
          setErrorMessage(errorData.message);
        } else if (errorData?.message) {
          setErrorMessage(errorData.message);
        } else {
          setErrorMessage('Failed to submit application. Please verify your details and try again.');
        }
      } else {
        setErrorMessage('Network error occurred. Please check your internet connection and try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
    setFieldErrors({});
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-2xl p-6 md:p-8 max-w-2xl w-full relative shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleModalClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-6 pb-4 border-b border-gray-100">
          <Heading level={2} color="navy" id="modal-title" className="text-xl sm:text-2xl mb-1">
            Apply for {jobTitle}
          </Heading>
          <Text size="small" color="muted">
            Provide your candidate information, passport details, and resume to apply for this vacancy.
          </Text>
        </div>

        {successMessage ? (
          <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-4 font-body">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <Heading level={3} color="navy" className="text-xl mb-1">
              Application Submitted!
            </Heading>
            <Text color="primary" size="regular" className="max-w-md mx-auto">
              {successMessage}
            </Text>
            <div className="pt-4">
              <Button variant="primary" onClick={handleModalClose}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800 text-sm font-body">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-0.5">Submission Error</p>
                  <p className="text-xs text-red-700">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* SECTION 1: Personal Information */}
            <Card className="p-4 sm:p-5 bg-neutral-50/60 border border-gray-200 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <User className="w-4 h-4 text-teal-600" />
                <Heading level={4} color="navy" className="text-sm font-bold mb-0">
                  1. Personal Information
                </Heading>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label="First Name"
                  required
                  placeholder="e.g. Rahul"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  error={fieldErrors.firstName}
                />
                <Input
                  label="Middle Name"
                  placeholder="Optional"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                />
                <Input
                  label="Last Name"
                  required
                  placeholder="e.g. Sharma"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  error={fieldErrors.lastName}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label="Email Address"
                  type="email"
                  required
                  placeholder="rahul@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={fieldErrors.email}
                />
                <Input
                  label="Phone Number"
                  required
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  error={fieldErrors.phone}
                />
                <Input
                  label="WhatsApp (Optional)"
                  placeholder="+91 9876543210"
                  value={whatsAppNumber}
                  onChange={(e) => setWhatsAppNumber(e.target.value)}
                />
              </div>
            </Card>

            {/* SECTION 2: Location & Passport */}
            <Card className="p-4 sm:p-5 bg-neutral-50/60 border border-gray-200 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <MapPin className="w-4 h-4 text-teal-600" />
                <Heading level={4} color="navy" className="text-sm font-bold mb-0">
                  2. Residence & Passport Details
                </Heading>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label="Country of Residence"
                  required
                  placeholder="e.g. India"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  error={fieldErrors.country}
                />
                <Input
                  label="State / Province"
                  required
                  placeholder="e.g. Delhi"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  error={fieldErrors.stateName}
                />
                <Input
                  label="City"
                  required
                  placeholder="e.g. New Delhi"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  error={fieldErrors.city}
                />
              </div>

              <div>
                <Input
                  label="Passport Number"
                  required
                  placeholder="e.g. Z9876543"
                  value={passportNumber}
                  onChange={(e) => setPassportNumber(e.target.value.toUpperCase())}
                  error={fieldErrors.passportNumber}
                  helperText="Must be 6-12 alphanumeric characters (auto-uppercased)"
                />
              </div>
            </Card>

            {/* SECTION 3: Work Experience & Salary */}
            <Card className="p-4 sm:p-5 bg-neutral-50/60 border border-gray-200 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <Briefcase className="w-4 h-4 text-teal-600" />
                <Heading level={4} color="navy" className="text-sm font-bold mb-0">
                  3. Work Experience & Compensation History
                </Heading>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label="Years of Experience"
                  type="number"
                  required
                  min="0"
                  max="40"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  error={fieldErrors.experienceYears}
                />
                <Input
                  label="Previous Employer / Company"
                  required
                  placeholder="e.g. L&T Construction"
                  value={previousCompany}
                  onChange={(e) => setPreviousCompany(e.target.value)}
                  error={fieldErrors.previousCompany}
                />
                <Input
                  label="Previous Role / Designation"
                  required
                  placeholder="e.g. Site Supervisor"
                  value={previousRole}
                  onChange={(e) => setPreviousRole(e.target.value)}
                  error={fieldErrors.previousRole}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Previous CTC Amount"
                  type="number"
                  required
                  placeholder="e.g. 650000"
                  value={previousCTCAmount}
                  onChange={(e) => setPreviousCTCAmount(e.target.value)}
                  error={fieldErrors.previousCTCAmount}
                />
                <div>
                  <Label required>CTC Currency (INR / NGN Only)</Label>
                  <select
                    value={previousCTCCurrency}
                    onChange={(e) => setPreviousCTCCurrency(e.target.value as 'INR' | 'NGN')}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-body text-neutral-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="INR">INR (₹ Indian Rupee)</option>
                    <option value="NGN">NGN (₦ Nigerian Naira)</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* SECTION 4: Document Uploads */}
            <Card className="p-4 sm:p-5 bg-neutral-50/60 border border-gray-200 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <FileCheck className="w-4 h-4 text-teal-600" />
                <Heading level={4} color="navy" className="text-sm font-bold mb-0">
                  4. Required Document Attachments (Max 5MB per file)
                </Heading>
              </div>

              {/* Passport Upload */}
              <div>
                <Label required>Passport Copy (.PDF, .PNG, .JPG)</Label>
                <div className="mt-1 flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-500 transition-colors bg-white">
                  <label className="cursor-pointer flex items-center gap-2 text-xs sm:text-sm text-navy-900 font-semibold font-body">
                    <Upload className="w-4 h-4 text-teal-500" />
                    <span>{passportFile ? passportFile.name : 'Select Passport File (Max 5MB)'}</span>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      className="hidden"
                      onChange={handlePassportFileChange}
                    />
                  </label>
                </div>
                {fieldErrors.passportFile && (
                  <p className="mt-1 text-xs text-red-600 font-body font-medium">{fieldErrors.passportFile}</p>
                )}
              </div>

              {/* Resume Upload */}
              <div>
                <Label required>Resume / CV (.PDF or .DOCX only)</Label>
                <div className="mt-1 flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-500 transition-colors bg-white">
                  <label className="cursor-pointer flex items-center gap-2 text-xs sm:text-sm text-navy-900 font-semibold font-body">
                    <Upload className="w-4 h-4 text-teal-500" />
                    <span>{resumeFile ? resumeFile.name : 'Select Resume File (.pdf or .docx - Max 5MB)'}</span>
                    <input
                      type="file"
                      accept=".pdf,.docx"
                      className="hidden"
                      onChange={handleResumeFileChange}
                    />
                  </label>
                </div>
                {fieldErrors.resumeFile && (
                  <p className="mt-1 text-xs text-red-600 font-body font-medium">{fieldErrors.resumeFile}</p>
                )}
              </div>
            </Card>

            {/* Modal Actions */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
              <Button variant="outline" size="md" type="button" onClick={handleModalClose} disabled={submitting}>
                Cancel
              </Button>
              <Button variant="gradient" size="md" type="submit" isLoading={submitting}>
                Submit Candidate Application
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default JobApplicationModal;
