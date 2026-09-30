import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import {
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  FileText,
  Store,
  ChevronDown,
  Globe,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { Heading, Text, Label } from '../components/ui/Typography';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { SectionHead } from '../components/ui/SectionHead';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { API_BASE_URL, COUNTRIES } from '../config/constants';

export const Contact: React.FC = () => {
  const [formType, setFormType] = useState<'RFP' | 'VendorRegistration'>('RFP');

  // Shared Form Fields
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [targetCountry, setTargetCountry] = useState('Nigeria');
  const [serviceCategory, setServiceCategory] = useState('EPC & MEP Contracting');
  const [message, setMessage] = useState('');

  // RFP Specific
  const [estimatedBudget, setEstimatedBudget] = useState('$100k - $500k');

  // Vendor Specific
  const [registrationTaxId, setRegistrationTaxId] = useState('');
  const [vendorCategory, setVendorCategory] = useState('Electrical & Switchgears');
  const [yearsInBusiness, setYearsInBusiness] = useState('5-10 Years');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Accordion open state for FAQ
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Selected map office pin state
  const [activeMapSlug, setActiveMapSlug] = useState<string>('nigeria');

  const officeLocations = [
    {
      slug: 'nigeria',
      name: 'Nigeria Corporate Office',
      flag: '🇳🇬',
      city: 'Victoria Island, Lagos',
      address: 'Plot 14, Victoria Island Commercial District, Lagos, Nigeria',
      phones: ['+234 1 234 5678', '+234 80 123 4567'],
      emails: ['info@meraldgroup.com', 'nigeria@meraldgroup.com'],
      embedUrl:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63430.730248232!2d3.398687!3d6.430076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c7d9e1!2sVictoria%20Island%2C%20Lagos%2C%20Nigeria!5e0!3m2!1sen!2sin!4v1680000000000',
    },
    {
      slug: 'india',
      name: 'India Corporate Office',
      flag: '🇮🇳',
      city: 'Tri Nagar, New Delhi',
      address: 'Plot 42, Commercial Complex, Tri Nagar, New Delhi 110035, India',
      phones: ['+91 11 2738 4567', '+91 98 100 23456'],
      emails: ['india@meraldgroup.com', 'info@meraldgroup.com'],
      embedUrl:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14002.32!2d77.1610!3d28.6922!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d0240d4f6c40d%3A0x6b4a3a6b5711a12!2sTri%20Nagar%2C%20Delhi%2C%20110035!5e0!3m2!1sen!2sin!4v1680000000000',
    },
    {
      slug: 'uae',
      name: 'UAE Regional Office',
      flag: '🇦🇪',
      city: 'Business Bay, Dubai',
      address: 'Business Bay Tower, Office 1402, Dubai, UAE',
      phones: ['+971 4 567 8900'],
      emails: ['uae@meraldgroup.com'],
      embedUrl:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28882.11!2d55.2708!3d25.1862!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f682def26a615%3A0x296f8c44c538356!2sBusiness%20Bay%2C%20Dubai%2C%20UAE!5e0!3m2!1sen!2sin!4v1680000000000',
    },
    {
      slug: 'ghana',
      name: 'Ghana Branch Office',
      flag: '🇬🇭',
      city: 'Airport Residential Area, Accra',
      address: 'Airport Residential Area, Accra, Ghana',
      phones: ['+233 30 212 3456'],
      emails: ['ghana@meraldgroup.com'],
      embedUrl:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15882.3!2d-0.1833!3d5.6000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9a75161048e9%3A0xb36bfaae471869e5!2sAirport%20Residential%20Area%2C%20Accra%2C%20Ghana!5e0!3m2!1sen!2sin!4v1680000000000',
    },
    {
      slug: 'uganda',
      name: 'Uganda Regional Office',
      flag: '🇺🇬',
      city: 'Nakasero Hill, Kampala',
      address: 'Nakasero Business Hill, Kampala, Uganda',
      phones: ['+256 41 412 3456'],
      emails: ['uganda@meraldgroup.com'],
      embedUrl:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15959.0!2d32.5822!3d0.3163!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbb7e8d249f05%3A0xa97c9b8cfcb08e33!2sNakasero%2C%20Kampala%2C%20Uganda!5e0!3m2!1sen!2sin!4v1680000000000',
    },
  ];

  const faqs = [
    {
      question: 'What is the expected response time for RFP submissions?',
      answer:
        'Our commercial engineering team reviews all incoming Request for Proposals within 24 business hours. A dedicated regional technical lead will be assigned to contact you directly with an initial evaluation.',
    },
    {
      question: 'How does the Vendor & Sub-Contractor registration process work?',
      answer:
        'Submitting the registration form registers your business credentials in Merald’s central procurement portal. Following ISO & HSE verification, approved vendors are invited to bid on regional MEP, heavy material, and logistics tenders.',
    },
    {
      question: 'Which countries does Merald Group currently execute live projects in?',
      answer:
        'We maintain fully operational corporate and project hubs in Nigeria (Lagos & Abuja), India (Delhi & Gurgaon), UAE (Dubai), Ghana (Accra), and Uganda (Kampala), with rapid cross-border deployment capabilities.',
    },
    {
      question: 'Can Merald deploy emergency MEP technical manpower to remote sites?',
      answer:
        'Yes. We maintain a database of over 6,400 certified engineers, site supervisors, and MEP technicians ready for mobilization within 48 to 72 hours across West Africa, the Middle East, and East Africa.',
    },
  ];

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        inquiryType: formType,
        fullName,
        companyName,
        email,
        phone,
        targetCountry,
        serviceCategory,
        message,
        estimatedBudget: formType === 'RFP' ? estimatedBudget : undefined,
        registrationTaxId: formType === 'VendorRegistration' ? registrationTaxId : undefined,
        vendorCategory: formType === 'VendorRegistration' ? vendorCategory : undefined,
        yearsInBusiness: formType === 'VendorRegistration' ? yearsInBusiness : undefined,
      };

      const res = await axios.post(`${API_BASE_URL}/inquiries`, payload);
      if (res.data.success) {
        setSubmitted(true);
      } else {
        setSubmitted(true);
      }
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedMapOffice = officeLocations.find((o) => o.slug === activeMapSlug) || officeLocations[0];

  return (
    <>
      <Helmet>
        <title>Contact Us — Merald Group Offices, RFP & Vendor Registration</title>
        <meta
          name="description"
          content="Contact Merald Group corporate offices in Nigeria and India. Submit project RFP inquiries, register as an approved supplier, or view our global office map."
        />
      </Helmet>

      {/* ---------------- SECTION 1: HERO / SPLIT SECTION ---------------- */}
      <section className="relative w-full py-20 bg-transparent text-white overflow-hidden">
        {/* Hero Background Image Placeholder - Replace src URL when needed */}
        <img
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=80"
          alt="Contact Hero Background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-navy-900/70 z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7">
              <ScrollReveal direction="up">
                <SectionHead
                  eyebrow="Global Communications"
                  title="Connect with Merald Commercial Teams"
                  lede="Whether initiating a major EPC contract, requesting a project proposal, or registering your firm as an approved supplier, our regional leaders are here to collaborate."
                  align="left"
                  inverted
                />
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.2}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs">
                    <Clock className="w-5 h-5 text-mint-400 mb-2" />
                    <p className="font-heading font-bold text-sm text-white">24h SLA Response</p>
                    <p className="text-xs text-gray-300 font-body">Direct response from regional leads.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs">
                    <ShieldCheck className="w-5 h-5 text-mint-400 mb-2" />
                    <p className="font-heading font-bold text-sm text-white">ISO & HSE Compliant</p>
                    <p className="text-xs text-gray-300 font-body">Vetted vendor onboarding.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs">
                    <Globe className="w-5 h-5 text-mint-400 mb-2" />
                    <p className="font-heading font-bold text-sm text-white">5 Active Regions</p>
                    <p className="text-xs text-gray-300 font-body">Local ground teams available.</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Split Visual Section */}
            <div className="lg:col-span-5">
              <ScrollReveal direction="left" delay={0.2}>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 group">
                  <img
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
                    alt="Merald Group Corporate Office"
                    className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/40 to-transparent flex flex-col justify-end p-6">
                    <Badge variant="mint" className="w-fit mb-2">Regional Operational Hubs</Badge>
                    <Heading level={3} color="white" className="text-xl">Nigeria & India Corporate Offices</Heading>
                    <Text size="small" color="white" className="opacity-90">
                      Victoria Island, Lagos & Tri Nagar, New Delhi
                    </Text>
                  </div>
                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------- SECTION 2: OFFICES SECTION (NIGERIA & INDIA SIDE-BY-SIDE) ---------------- */}
      <section className="py-20 bg-neutral-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHead
              eyebrow="Corporate Headquarters"
              title="Nigeria & India Primary Offices"
              lede="Our two principal corporate bases serve as the regional command centers for West Africa, Asia, and international operations."
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Nigeria Corporate Office */}
            <ScrollReveal direction="up" delay={0.1}>
              <Card hoverEffect borderAccent className="p-8 h-full bg-white flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">🇳🇬</span>
                      <div>
                        <Heading level={3} color="navy" className="text-xl mb-0.5">
                          Nigeria Corporate Office
                        </Heading>
                        <Text size="small" color="teal" weight="semibold">
                          Victoria Island, Lagos
                        </Text>
                      </div>
                    </div>
                    <Badge variant="navy">HQ West Africa</Badge>
                  </div>

                  <div className="space-y-3 font-body text-sm text-neutral-700 mb-6">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                      <span>Plot 14, Victoria Island Commercial District, Lagos, Nigeria</span>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-navy-900">+234 1 234 5678</p>
                        <p className="text-xs text-neutral-500">+234 80 123 4567 (Direct Ops)</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-navy-900">info@meraldgroup.com</p>
                        <p className="text-xs text-neutral-500">nigeria@meraldgroup.com</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-body">Operating Hours: Mon - Sat (8:00 AM - 6:00 PM)</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveMapSlug('nigeria')}
                  >
                    View on Map
                  </Button>
                </div>
              </Card>
            </ScrollReveal>

            {/* India Corporate Office */}
            <ScrollReveal direction="up" delay={0.2}>
              <Card hoverEffect borderAccent className="p-8 h-full bg-white flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">🇮🇳</span>
                      <div>
                        <Heading level={3} color="navy" className="text-xl mb-0.5">
                          India Corporate Office
                        </Heading>
                        <Text size="small" color="teal" weight="semibold">
                          Tri Nagar, New Delhi
                        </Text>
                      </div>
                    </div>
                    <Badge variant="navy">HQ Asia / Middle East</Badge>
                  </div>

                  <div className="space-y-3 font-body text-sm text-neutral-700 mb-6">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                      <span>Plot 42, Commercial Complex, Tri Nagar, New Delhi 110035, India</span>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-navy-900">+91 11 2738 4567</p>
                        <p className="text-xs text-neutral-500">+91 98 100 23456 (Engineering Desk)</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-navy-900">india@meraldgroup.com</p>
                        <p className="text-xs text-neutral-500">info@meraldgroup.com</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-body">Operating Hours: Mon - Sat (9:00 AM - 6:30 PM)</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveMapSlug('india')}
                  >
                    View on Map
                  </Button>
                </div>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ---------------- SECTION 3: DUAL-PURPOSE SMART FORM ---------------- */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHead
              eyebrow="Commercial Portal"
              title="Interactive RFP & Vendor Registration Form"
              lede="Select your intent below to submit project specifications or apply as an approved supplier/sub-contractor."
            />
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="bg-neutral-100 rounded-2xl p-6 sm:p-10 shadow-lg border border-gray-200">
              
              {/* Tab Switcher */}
              <div className="flex items-center p-1.5 bg-gray-200 rounded-xl mb-8">
                <button
                  type="button"
                  onClick={() => setFormType('RFP')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-body font-semibold text-sm transition-all cursor-pointer ${
                    formType === 'RFP'
                      ? 'bg-navy-900 text-white shadow-md'
                      : 'text-gray-600 hover:text-navy-900'
                  }`}
                >
                  <FileText className="w-4 h-4" /> Business / Project RFP
                </button>

                <button
                  type="button"
                  onClick={() => setFormType('VendorRegistration')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-body font-semibold text-sm transition-all cursor-pointer ${
                    formType === 'VendorRegistration'
                      ? 'bg-navy-900 text-white shadow-md'
                      : 'text-gray-600 hover:text-navy-900'
                  }`}
                >
                  <Store className="w-4 h-4" /> Vendor & Sub-Contractor Registration
                </button>
              </div>

              {submitted ? (
                <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                  <Heading level={3} color="navy" className="mb-2">
                    {formType === 'RFP' ? 'RFP Inquiry Received!' : 'Vendor Application Received!'}
                  </Heading>
                  <Text color="muted" className="max-w-md mx-auto mb-6">
                    Thank you, {fullName}. Our commercial engineering team for {targetCountry} will evaluate your submission and contact you within 24 business hours.
                  </Text>
                  <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                    Submit Another Inquiry
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmitInquiry} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Contact Full Name"
                      required
                      placeholder="e.g. David Okonjo"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                    <Input
                      label="Company / Organization"
                      required
                      placeholder="e.g. Apex Industrial Ltd"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Business Email Address"
                      type="email"
                      required
                      placeholder="david@apexind.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                      label="Phone Number / Whatsapp"
                      required
                      placeholder="+234 80 1234 5678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  {/* Fields Specific to Selected Tab */}
                  {formType === 'RFP' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <Label required>Target Operating Region</Label>
                        <select
                          value={targetCountry}
                          onChange={(e) => setTargetCountry(e.target.value)}
                          className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-body text-neutral-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        >
                          {COUNTRIES.map((c) => (
                            <option key={c.slug} value={c.name}>{c.flag} {c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <Label required>Service Vertical</Label>
                        <select
                          value={serviceCategory}
                          onChange={(e) => setServiceCategory(e.target.value)}
                          className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-body text-neutral-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        >
                          <option value="EPC & MEP Contracting">EPC & MEP Contracting</option>
                          <option value="Integrated Facility Management (IFM)">Integrated Facility Management (IFM)</option>
                          <option value="Product & Board Distribution">Product & Board Distribution</option>
                          <option value="Haulify Heavy Logistics">Haulify Heavy Logistics</option>
                          <option value="Technical Manpower Supply">Technical Manpower Supply</option>
                        </select>
                      </div>

                      <div>
                        <Label>Estimated Budget Range</Label>
                        <select
                          value={estimatedBudget}
                          onChange={(e) => setEstimatedBudget(e.target.value)}
                          className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-body text-neutral-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        >
                          <option value="Under $100k">Under $100k</option>
                          <option value="$100k - $500k">$100k - $500k</option>
                          <option value="$500k - $2M">$500k - $2M</option>
                          <option value="$2M+">$2M+ Major Project</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Input
                        label="Tax ID / Registration Number"
                        required
                        placeholder="e.g. RC-129485"
                        value={registrationTaxId}
                        onChange={(e) => setRegistrationTaxId(e.target.value)}
                      />

                      <div>
                        <Label required>Supply / Trade Specialty</Label>
                        <select
                          value={vendorCategory}
                          onChange={(e) => setVendorCategory(e.target.value)}
                          className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-body text-neutral-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        >
                          <option value="Electrical & Switchgears">Electrical & Switchgears</option>
                          <option value="HVAC Chillers & Ducting">HVAC Chillers & Ducting</option>
                          <option value="Piping & Valves">Piping & Valves</option>
                          <option value="Heavy Fleet & Transportation">Heavy Fleet & Transportation</option>
                          <option value="Safety & HSE Gear">Safety & HSE Gear</option>
                          <option value="Civil & Structural Works">Civil & Structural Works</option>
                        </select>
                      </div>

                      <div>
                        <Label required>Years in Business</Label>
                        <select
                          value={yearsInBusiness}
                          onChange={(e) => setYearsInBusiness(e.target.value)}
                          className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-body text-neutral-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        >
                          <option value="1-3 Years">1-3 Years</option>
                          <option value="3-5 Years">3-5 Years</option>
                          <option value="5-10 Years">5-10 Years</option>
                          <option value="10+ Years">10+ Years</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label required>
                      {formType === 'RFP'
                        ? 'Project Scope & Requirements Summary'
                        : 'Company Profile & Supply Capabilities'}
                    </Label>
                    <textarea
                      rows={4}
                      required
                      placeholder={
                        formType === 'RFP'
                          ? 'Provide details regarding location, scope of work, timeline, and engineering specifications...'
                          : 'Describe your material inventory, equipment fleet, ISO certifications, and previous work...'
                      }
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-neutral-900 placeholder-neutral-400 font-body focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                    />
                  </div>

                  <Button variant="gradient" size="lg" type="submit" isLoading={submitting} className="w-full justify-center shadow-lg font-semibold">
                    <Send className="w-4 h-4 mr-2" />
                    Submit {formType === 'RFP' ? 'Project RFP Inquiry' : 'Vendor Registration'}
                  </Button>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ---------------- SECTION 4: FAQ SECTION ---------------- */}
      <section className="py-20 bg-neutral-100 border-t border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHead
              eyebrow="Commercial FAQ"
              title="Frequently Asked Questions"
              lede="Answers to common questions regarding client RFP submissions, vendor onboarding, and regional deployment."
            />
          </ScrollReveal>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <ScrollReveal key={idx} delay={idx * 0.08}>
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs transition-all">
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-5 flex items-center justify-between text-left font-heading font-bold text-navy-900 hover:text-teal-500 transition-colors cursor-pointer"
                    >
                      <span className="text-base sm:text-lg">{faq.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-teal-500 shrink-0 transform transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-0 font-body text-sm text-neutral-600 leading-relaxed border-t border-gray-100 mt-2">
                        <p className="pt-3">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- SECTION 5: INTERACTIVE MAP SECTION ---------------- */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHead
              eyebrow="Interactive Location Pins"
              title="Global Office Network Map"
              lede="Select an operating office below to view precise location details, address pins, and direct contact numbers."
            />
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            {/* Map Country Selector Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              {officeLocations.map((office) => (
                <button
                  key={office.slug}
                  onClick={() => setActiveMapSlug(office.slug)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold font-body border transition-all cursor-pointer ${
                    activeMapSlug === office.slug
                      ? 'bg-navy-900 text-white border-navy-900 shadow-md'
                      : 'bg-neutral-100 text-neutral-700 border-gray-200 hover:bg-neutral-200'
                  }`}
                >
                  <span>{office.flag}</span>
                  <span>{office.name.replace(' Office', '')}</span>
                </button>
              ))}
            </div>

            {/* Map Frame & Info Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Left Details Card */}
              <div className="lg:col-span-4 bg-navy-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{selectedMapOffice.flag}</span>
                    <div>
                      <Badge variant="mint" className="mb-1">{selectedMapOffice.city}</Badge>
                      <Heading level={3} color="white" className="text-xl">
                        {selectedMapOffice.name}
                      </Heading>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs sm:text-sm text-gray-200 font-body mb-6 border-t border-white/10 pt-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-mint-400 shrink-0 mt-0.5" />
                      <span>{selectedMapOffice.address}</span>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-mint-400 shrink-0 mt-0.5" />
                      <div>
                        {selectedMapOffice.phones.map((p, i) => (
                          <p key={i} className="font-semibold">{p}</p>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-mint-400 shrink-0 mt-0.5" />
                      <div>
                        {selectedMapOffice.emails.map((e, i) => (
                          <p key={i}>{e}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <a
                    href={`mailto:${selectedMapOffice.emails[0]}`}
                    className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-teal-500 text-white font-bold text-sm hover:bg-teal-400 transition-colors font-body"
                  >
                    Email Regional Desk <Mail className="w-4 h-4 ml-2" />
                  </a>
                </div>
              </div>

              {/* Right Embedded Google Map */}
              <div className="lg:col-span-8 rounded-2xl overflow-hidden border border-gray-200 shadow-xl min-h-[350px]">
                <iframe
                  title={`${selectedMapOffice.name} Google Map`}
                  src={selectedMapOffice.embedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '380px' }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
};

export default Contact;
