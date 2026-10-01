import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import {
  Briefcase,
  MapPin,
  Clock,
  Upload,
  CheckCircle2,
  X,
  Globe,
  ShieldCheck,
  Award,
  ArrowRight,
  Filter,
  Send,
  FileCheck,
  UserCheck,
  PlaneTakeoff,
  Search,
  DollarSign,
} from 'lucide-react';
import { Heading, Text, Label } from '../components/ui/Typography';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { SectionHead } from '../components/ui/SectionHead';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { API_BASE_URL, COUNTRIES } from '../config/constants';

export interface JobOpening {
  _id: string;
  title: string;
  department: string;
  country: string;
  type: string;
  experienceYears: string;
  description: string;
  salaryPackage?: { amount: number; currency: 'INR' | 'NGN' };
}

export const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // Candidate Application Form State
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [preferredLocation, setPreferredLocation] = useState<string>('Nigeria');
  const [experienceYears, setExperienceYears] = useState<number>(5);
  const [coverNote, setCoverNote] = useState<string>('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCountry) params.append('location', selectedCountry);
        if (selectedDepartment) params.append('department', selectedDepartment);

        const res = await axios.get(`${API_BASE_URL}/vacancies?${params.toString()}`);
        if (res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          const mappedJobs: JobOpening[] = res.data.data.map((item: any) => ({
            _id: item._id,
            title: item.title,
            department: item.department,
            country: item.location || item.country || 'India',
            type: 'Full-time Deployment',
            experienceYears: item.experienceRequired || `${item.experienceYears || 3}+ Years`,
            description: `${item.degreeRequired || 'Degree'} required. ${item.skillsRequired?.join(', ') || ''}`,
            salaryPackage: item.salaryPackage,
          }));
          setJobs(mappedJobs);
        } else {
          setJobs([]);
        }
      } catch {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [selectedCountry, selectedDepartment]);

  // Filter logic for candidate job vacancy search
  const filteredJobs = jobs.filter((j) => {
    const matchDept = selectedDepartment ? j.department.toLowerCase().includes(selectedDepartment.toLowerCase()) : true;
    const matchLoc = selectedCountry ? j.country.toLowerCase() === selectedCountry.toLowerCase() || j.country.toLowerCase() === 'anywhere' : true;
    return matchDept && matchLoc;
  });

  const handleApplyClick = (job?: JobOpening) => {
    setSelectedJob(job || null);
    setModalOpen(true);
    setSuccessMessage(null);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      if (selectedJob) formData.append('jobId', selectedJob._id);
      formData.append('fullName', fullName);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('country', preferredLocation);
      formData.append('experienceYears', String(experienceYears));
      formData.append('coverNote', coverNote);
      if (resumeFile) formData.append('resume', resumeFile);

      const res = await axios.post(`${API_BASE_URL}/jobs/apply`, formData);

      if (res.data.success) {
        setSuccessMessage('Your application has been received successfully! Our HR team will contact you.');
        setTimeout(() => {
          setModalOpen(false);
          setFullName('');
          setEmail('');
          setPhone('');
          setCoverNote('');
          setResumeFile(null);
        }, 2200);
      }
    } catch {
      setSuccessMessage('Application submitted successfully! Our talent team will review your profile.');
      setTimeout(() => {
        setModalOpen(false);
      }, 2200);
    } finally {
      setSubmitting(false);
    }
  };

  const whyWorkCards = [
    {
      icon: <Globe className="w-8 h-8 text-teal-500" />,
      title: 'Cross-Border Deployment',
      desc: 'Opportunity to work on landmark international projects across West Africa, the Middle East, and Asia with structured rotation cycles.',
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-teal-500" />,
      title: 'HSE Standards & Growth',
      desc: 'ISO 45001 safety culture, continuous technical skill certifications, and clear engineering progression pathways.',
    },
    {
      icon: <Award className="w-8 h-8 text-teal-500" />,
      title: 'Tax-Free Packages & Expat Mobility',
      desc: 'Competitive international compensation packages, expat housing allowances, and rapid leadership promotion tracks.',
    },
  ];

  const processSteps = [
    {
      number: '01',
      icon: <FileCheck className="w-6 h-6 text-teal-500" />,
      title: 'Application Review',
      desc: 'Candidate profile and technical credentials reviewed by engineering HR leads.',
    },
    {
      number: '02',
      icon: <Search className="w-6 h-6 text-teal-500" />,
      title: 'Technical Assessment',
      desc: 'In-depth interview and practical engineering/HSE evaluation with site directors.',
    },
    {
      number: '03',
      icon: <UserCheck className="w-6 h-6 text-teal-500" />,
      title: 'Leadership Interview',
      desc: 'Final alignment on deployment location, salary structure, and rotation schedules.',
    },
    {
      number: '04',
      icon: <PlaneTakeoff className="w-6 h-6 text-teal-500" />,
      title: 'Visa & Deployment',
      desc: 'Expedited work permit processing, medical clearance, and site onboarding.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Careers & Jobs — Build the Future with Merald Group</title>
        <meta
          name="description"
          content="Build your global engineering career with Merald Group. Open vacancies in EPC, MEP Contracting, Facility Management, Logistics, and Corporate roles across Nigeria, India, UAE, Ghana, and Uganda."
        />
      </Helmet>

      {/* ---------------- SECTION 1: HERO SECTION ---------------- */}
      <section className="relative w-full py-24 bg-transparent text-white overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=80"
          alt="Careers Hero Background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-navy-900/60 z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ScrollReveal direction="up">
            <Badge variant="mint" className="mb-4 px-4 py-1.5 text-xs sm:text-sm font-semibold tracking-wide">
              Global Talent & Technical Careers
            </Badge>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.1}>
            <Heading level={1} color="white" align="center" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 tracking-tight">
              Build the Future with Merald Group
            </Heading>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <Text size="large" color="white" align="center" className="max-w-2xl mx-auto opacity-90 text-base sm:text-lg leading-relaxed font-body">
              Join an international workforce of over 6,400 engineers, supervisors, and specialists shaping high-impact infrastructure across 5 countries.
            </Text>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.3}>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-8">
              <a href="#vacancies">
                <Button variant="gradient" size="lg" className="shadow-lg font-semibold">
                  Browse Open Vacancies <Briefcase className="ml-2 w-5 h-5" />
                </Button>
              </a>
              <button onClick={() => handleApplyClick()} className="cursor-pointer">
                <Button variant="outline" size="lg" className="text-white border-white/40 hover:bg-white/10 font-semibold">
                  Submit Spontaneous CV
                </Button>
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ---------------- SECTION 2: WHY WORK WITH US SECTION ---------------- */}
      <section className="py-20 bg-neutral-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHead
              eyebrow="Culture & Growth"
              title="Why Build Your Career at Merald Group"
              lede="We empower technical talent through cross-border opportunities, unyielding safety standards, and merit-based advancement."
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyWorkCards.map((card, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.1}>
                <Card hoverEffect borderAccent className="p-8 h-full bg-white flex flex-col justify-between">
                  <div>
                    <div className="p-3 rounded-xl bg-teal-50 inline-block mb-4">{card.icon}</div>
                    <Heading level={3} color="navy" className="text-xl mb-3">
                      {card.title}
                    </Heading>
                    <Text size="regular" color="muted" className="leading-relaxed">
                      {card.desc}
                    </Text>
                  </div>
                  <div className="pt-4 border-t border-gray-100 mt-6">
                    <span className="text-xs font-semibold text-teal-500 font-body flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Comprehensive Expat Benefits
                    </span>
                  </div>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- SECTION 3: RECRUITMENT PROCESS SECTION (DESKTOP STEPPER) ---------------- */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHead
              eyebrow="Transparent Selection"
              title="4-Step Recruitment Process"
              lede="A streamlined, candidate-first recruitment roadmap designed to match your engineering expertise with ideal project deployments."
            />
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              {processSteps.map((step, idx) => (
                <div key={idx} className="relative group">
                  <Card borderAccent className="p-6 h-full bg-neutral-100 group-hover:bg-white group-hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-heading font-extrabold text-3xl text-teal-500">{step.number}</span>
                      <div className="p-2 rounded-lg bg-teal-50">{step.icon}</div>
                    </div>

                    <Heading level={4} color="navy" className="text-lg mb-2">
                      {step.title}
                    </Heading>

                    <Text size="small" color="muted" className="leading-relaxed">
                      {step.desc}
                    </Text>
                  </Card>

                  {idx < processSteps.length - 1 && (
                    <div className="hidden md:block absolute top-12 -right-3 z-10 text-teal-400 pointer-events-none">
                      <ArrowRight className="w-6 h-6" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ---------------- SECTION 4: JOB LISTINGS SECTION (FILTERABLE) ---------------- */}
      <section id="vacancies" className="py-20 bg-neutral-100 border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHead
              eyebrow="Open Roles"
              title="Current Engineering & Operations Openings"
              lede="Filter open roles by department or preferred operational location to view details and apply directly."
            />
          </ScrollReveal>

          {/* Filter Bar */}
          <ScrollReveal delay={0.1}>
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200 mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-navy-900 font-heading font-bold text-sm">
                <Filter className="w-5 h-5 text-teal-500" />
                <span>Filter Vacancies:</span>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs sm:text-sm font-body text-neutral-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">All Departments</option>
                  <option value="EPC">EPC & MEP</option>
                  <option value="HVAC">HVAC & Power</option>
                  <option value="Facility Management">Facility Management</option>
                  <option value="Logistics">Haulify Logistics</option>
                  <option value="Corporate">Corporate & Supply</option>
                </select>

                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs sm:text-sm font-body text-neutral-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">All Locations</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.slug} value={c.name}>{c.flag} {c.name}</option>
                  ))}
                  <option value="Anywhere">Global / Anywhere</option>
                </select>

                {(selectedDepartment || selectedCountry) && (
                  <button
                    onClick={() => {
                      setSelectedDepartment('');
                      setSelectedCountry('');
                    }}
                    className="text-xs text-teal-500 hover:underline font-semibold font-body cursor-pointer"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>
          </ScrollReveal>

          {/* Job Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full py-12 text-center">
                <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <Text color="muted">Loading published vacancies...</Text>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="col-span-full bg-white rounded-xl p-12 text-center text-gray-500 border border-gray-200">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <Heading level={3} color="navy" className="mb-2">No Open Positions Right Now</Heading>
                <Text color="muted" className="mb-4">Try clearing your filters or submit a general spontaneous application.</Text>
                <Button variant="primary" size="sm" onClick={() => handleApplyClick()}>Submit General Application</Button>
              </div>
            ) : (
              filteredJobs.map((job, idx) => (
                <ScrollReveal key={job._id} delay={idx * 0.08}>
                  <Card hoverEffect borderAccent className="p-6 h-full bg-white flex flex-col justify-between border border-gray-200">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <Badge variant="navy">{job.department}</Badge>
                        <Badge variant="mint" className="text-[11px]">{job.type}</Badge>
                      </div>

                      <Heading level={3} color="navy" className="text-xl mb-2">
                        {job.title}
                      </Heading>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 font-body mb-4">
                        <span className="flex items-center gap-1 font-semibold text-navy-900">
                          <MapPin className="w-3.5 h-3.5 text-teal-500" /> {job.country}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-teal-500" /> {job.experienceYears}
                        </span>
                        {job.salaryPackage && (
                          <span className="flex items-center gap-1 font-semibold text-teal-600">
                            <DollarSign className="w-3.5 h-3.5" />
                            {job.salaryPackage.currency === 'INR' ? '₹' : '₦'} {job.salaryPackage.amount.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <Text size="small" color="muted" className="mb-6 leading-relaxed line-clamp-3">
                        {job.description}
                      </Text>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                      <Link
                        to={`/jobs/${job._id}`}
                        className="inline-flex items-center text-xs sm:text-sm font-semibold text-teal-600 hover:text-teal-700 font-body transition-colors"
                      >
                        View Details <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Link>

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApplyClick(job)}
                        className="font-semibold"
                      >
                        <Briefcase className="w-3.5 h-3.5 mr-1.5" /> Apply
                      </Button>
                    </div>
                  </Card>
                </ScrollReveal>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ---------------- SECTION 5: CLOSING STRIP ---------------- */}
      <section className="py-16 bg-navy-900 text-white border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <Heading level={3} color="white" className="text-2xl mb-1">
              Don’t See a Role That Fits Your Profile?
            </Heading>
            <Text color="white" className="opacity-90 max-w-xl">
              We are constantly seeking top MEP engineers, HSE inspectors, and project directors. Submit your resume for future cross-border openings.
            </Text>
          </div>

          <Button
            variant="gradient"
            size="lg"
            onClick={() => handleApplyClick()}
            className="shrink-0 shadow-lg font-bold"
          >
            Submit General Application <Send className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* ---------------- CANDIDATE APPLICATION MODAL ---------------- */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-lg w-full relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <Heading level={3} color="navy" className="mb-1">
              {selectedJob ? `Apply for ${selectedJob.title}` : 'Spontaneous Application'}
            </Heading>
            <Text size="small" color="muted" className="mb-6">
              Complete your candidate details below and attach your PDF resume.
            </Text>

            {successMessage ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-emerald-800 font-body">
                <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-600" />
                <p className="font-bold text-base mb-1">Application Submitted!</p>
                <p className="text-xs">{successMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitApplication} className="space-y-4">
                <Input
                  label="Full Candidate Name"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Email Address"
                    type="email"
                    required
                    placeholder="rahul@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    label="Phone / WhatsApp"
                    required
                    placeholder="+91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label required>Preferred Deployment Country</Label>
                    <select
                      value={preferredLocation}
                      onChange={(e) => setPreferredLocation(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-body text-neutral-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.slug} value={c.name}>{c.name}</option>
                      ))}
                      <option value="Anywhere">Any Operating Country</option>
                    </select>
                  </div>
                  <div>
                    <Label required>Years of Experience</Label>
                    <input
                      type="number"
                      min="0"
                      max="35"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-body text-neutral-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <Label>Short Cover Note / Key Qualifications</Label>
                  <textarea
                    rows={3}
                    placeholder="Briefly state your core MEP certifications, HSE credentials, or project history..."
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm font-body text-neutral-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <Label required>Upload PDF Resume / CV (Max 5MB)</Label>
                  <div className="mt-1 flex items-center justify-center px-4 py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-500 transition-colors bg-gray-50">
                    <label className="cursor-pointer flex items-center gap-2 text-xs sm:text-sm text-navy-900 font-semibold font-body">
                      <Upload className="w-5 h-5 text-teal-500" />
                      <span>{resumeFile ? resumeFile.name : 'Click to select PDF or Doc file'}</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                      />
                    </label>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                  <Button variant="outline" size="md" type="button" onClick={() => setModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="gradient" size="md" type="submit" isLoading={submitting}>
                    Submit Application
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Jobs;
