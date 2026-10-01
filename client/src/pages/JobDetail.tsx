import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import {
  Briefcase,
  Clock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Award,
  User,
  DollarSign,
  GraduationCap,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Heading, Text } from '../components/ui/Typography';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { JobApplicationModal } from '../components/jobs/JobApplicationModal';
import { API_BASE_URL } from '../config/constants';

export interface JobVacancyDetail {
  _id: string;
  title: string;
  department: string;
  salaryPackage: { amount: number; currency: 'INR' | 'NGN' };
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
  hiredCount: number;
  postedDate?: string;
  closingDate?: string;
  createdAt: string;
  updatedAt: string;
}

export const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vacancy, setVacancy] = useState<JobVacancyDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchVacancyDetail = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_BASE_URL}/vacancies/${id}`);
        if (res.data.success && res.data.data) {
          setVacancy(res.data.data);
        } else {
          setError('Job vacancy not found');
        }
      } catch (err: any) {
        setError(err.response?.data?.error?.message || 'This position is no longer available');
      } finally {
        setLoading(false);
      }
    };

    fetchVacancyDetail();
  }, [id]);

  const formatCurrency = (amount: number, currency: 'INR' | 'NGN') => {
    const symbol = currency === 'INR' ? '₹' : '₦';
    return `${symbol} ${amount.toLocaleString()}`;
  };

  const getLocationFlag = (location: string) => {
    switch (location) {
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

  if (loading) {
    return (
      <div className="min-h-screen py-24 bg-neutral-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <Text color="muted" size="regular">
            Loading position details...
          </Text>
        </div>
      </div>
    );
  }

  if (error || !vacancy) {
    return (
      <div className="min-h-screen py-24 bg-neutral-100 flex items-center justify-center px-4">
        <Card borderAccent className="max-w-lg w-full text-center p-8 bg-white shadow-xl">
          <div className="p-4 bg-amber-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-amber-600" />
          </div>
          <Heading level={2} color="navy" className="mb-2">
            This Position is No Longer Available
          </Heading>
          <Text color="muted" className="mb-6">
            The job opening you are looking for has been closed, filled, or does not exist on the Merald Group Career Portal.
          </Text>
          <Button variant="primary" onClick={() => navigate('/jobs')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Browse Open Vacancies
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${vacancy.title} — Careers | Merald Group`}</title>
        <meta
          name="description"
          content={`Apply for ${vacancy.title} in ${vacancy.location} with Merald Group. ${vacancy.experienceRequired} experience required.`}
        />
      </Helmet>

      <div className="min-h-screen bg-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Top Breadcrumb / Back Link */}
          <div>
            <Link
              to="/jobs"
              className="inline-flex items-center text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to All Open Vacancies
            </Link>
          </div>

          {/* Header Card */}
          <Card borderAccent className="p-6 md:p-8 bg-white shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="navy">{vacancy.department}</Badge>
                <Badge variant="mint">
                  {getLocationFlag(vacancy.location)} {vacancy.location}
                </Badge>
                <Badge variant="success">
                  {vacancy.openingsCount} {vacancy.openingsCount === 1 ? 'Opening' : 'Openings'}
                </Badge>
              </div>
              {vacancy.postedDate && (
                <Text size="small" color="muted">
                  Posted on {new Date(vacancy.postedDate).toLocaleDateString()}
                </Text>
              )}
            </div>

            <Heading level={1} color="navy" className="text-2xl sm:text-3xl lg:text-4xl mb-4">
              {vacancy.title}
            </Heading>

            {/* Overview Stats Pill Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-teal-50 rounded-lg text-teal-600">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <Text size="small" color="muted" className="text-xs">
                    Salary Package
                  </Text>
                  <Text size="regular" weight="semibold" color="navy">
                    {formatCurrency(vacancy.salaryPackage.amount, vacancy.salaryPackage.currency)}
                  </Text>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-teal-50 rounded-lg text-teal-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <Text size="small" color="muted" className="text-xs">
                    Experience Required
                  </Text>
                  <Text size="regular" weight="semibold" color="navy">
                    {vacancy.experienceRequired}
                  </Text>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-teal-50 rounded-lg text-teal-600">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <Text size="small" color="muted" className="text-xs">
                    Age Requirement
                  </Text>
                  <Text size="regular" weight="semibold" color="navy">
                    {vacancy.ageRequirement}
                  </Text>
                </div>
              </div>
            </div>
          </Card>

          {/* Specifications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Qualification & Skills Card */}
            <Card className="p-6 bg-white space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <GraduationCap className="w-5 h-5 text-teal-500" />
                <Heading level={3} color="navy" className="text-lg mb-0">
                  Requirements & Qualifications
                </Heading>
              </div>

              <div>
                <Text size="small" color="muted" weight="medium" className="mb-1">
                  Required Degree / Qualification
                </Text>
                <Text size="regular" color="primary" weight="semibold">
                  {vacancy.degreeRequired}
                </Text>
              </div>

              <div>
                <Text size="small" color="muted" weight="medium" className="mb-2">
                  Key Technical Skills
                </Text>
                <div className="flex flex-wrap gap-2">
                  {vacancy.skillsRequired.map((skill, idx) => (
                    <Badge key={idx} variant="navy">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Text size="small" color="muted" weight="medium" className="mb-2">
                  Required Documentation
                </Text>
                <ul className="space-y-2">
                  {vacancy.documentsRequired.map((doc, idx) => (
                    <li key={idx} className="flex items-center text-xs sm:text-sm text-neutral-900 font-body">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            {/* Facilities & Benefits Card */}
            <Card className="p-6 bg-white space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <Sparkles className="w-5 h-5 text-teal-500" />
                <Heading level={3} color="navy" className="text-lg mb-0">
                  Facilities & Benefits Provided
                </Heading>
              </div>

              <div>
                <Text size="small" color="muted" className="mb-4">
                  Merald Group provides comprehensive operational support and allowances for site deployments.
                </Text>

                <div className="flex flex-wrap gap-2">
                  {vacancy.facilitiesProvided.map((facility, idx) => (
                    <Badge key={idx} variant="mint" className="py-1.5 px-3">
                      <Award className="w-3.5 h-3.5 mr-1.5 text-teal-600" />
                      {facility}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Recruitment Process Stepper Section */}
          <Card className="p-6 md:p-8 bg-white space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <Layers className="w-5 h-5 text-teal-500" />
              <Heading level={3} color="navy" className="text-xl mb-0">
                Recruitment & Evaluation Pipeline
              </Heading>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {vacancy.recruitmentProcess.map((step) => (
                <div
                  key={step.stepNumber}
                  className="p-4 rounded-xl bg-neutral-100 border border-gray-200 flex flex-col justify-between"
                >
                  <div>
                    <span className="inline-block text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md mb-2">
                      Step {step.stepNumber}
                    </span>
                    <Heading level={4} color="navy" className="text-base mb-1">
                      {step.title}
                    </Heading>
                    <Text size="small" color="muted">
                      {step.description}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Bottom Action Section */}
          <Card className="p-8 bg-navy-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <Heading level={2} color="white" className="text-2xl mb-1">
                Ready to Join Merald Group?
              </Heading>
              <Text color="white" className="opacity-90">
                Submit your application and passport details for this role.
              </Text>
            </div>

            <Button
              variant="gradient"
              size="lg"
              className="w-full sm:w-auto font-extrabold shadow-lg"
              onClick={() => setIsApplyModalOpen(true)}
            >
              <Briefcase className="w-5 h-5 mr-2" /> Apply Now
            </Button>
          </Card>
        </div>
      </div>

      {vacancy && (
        <JobApplicationModal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          jobId={vacancy._id}
          jobTitle={vacancy.title}
        />
      )}
    </>
  );
};

export default JobDetail;
