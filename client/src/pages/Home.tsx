import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import {
  Building2,
  Wrench,
  Truck,
  Users,
  Box,
  ArrowRight,
  CheckCircle2,
  Globe2,
  Layers,
  ShieldCheck,
  Calendar,
  Briefcase,
  Award,
} from 'lucide-react';
import { Heading, Text } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { SectionHead } from '../components/ui/SectionHead';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { COUNTRIES, HERO_VIDEO_URL } from '../config/constants';

export const Home: React.FC = () => {
  const { t } = useTranslation();

  const verticals = [
    {
      icon: <Building2 className="w-8 h-8 text-teal-500" />,
      title: 'EPC & MEP Contracting',
      desc: 'End-to-end electrical, HVAC, plumbing, structural piping, and power distribution contracting for high-rise, commercial, and industrial infrastructure.',
      link: '/services#epc',
    },
    {
      icon: <Wrench className="w-8 h-8 text-teal-500" />,
      title: 'Integrated Facility Management (IFM)',
      desc: '24/7 technical operations, preventive MEP maintenance, cleanroom environmental management, and continuous asset lifecycle stewardship.',
      link: '/services#ifm',
    },
    {
      icon: <Box className="w-8 h-8 text-teal-500" />,
      title: 'Product & Board Distribution',
      desc: 'Authorized regional supply and distribution of heavy electrical boards, switchgears, power transformers, and certified industrial fittings.',
      link: '/services#distribution',
    },
    {
      icon: <Truck className="w-8 h-8 text-teal-500" />,
      title: 'Haulify Heavy Logistics',
      desc: 'Specialized cargo transportation, fleet haulage, heavy equipment logistics, and route clearance across West Africa, Middle East, and Asia.',
      link: '/services#haulify',
    },
    {
      icon: <Users className="w-8 h-8 text-teal-500" />,
      title: 'Global Technical Manpower',
      desc: 'Cross-border deployment of vetted master engineers, ISO/HSE safety supervisors, MEP technicians, and skilled industrial site crews.',
      link: '/services#manpower',
    },
  ];

  const featuredProjects = [
    {
      title: 'Industrial Piping & High-Pressure Substation',
      country: 'Nigeria',
      flag: '🇳🇬',
      category: 'EPC & Heavy Piping',
      desc: 'Complete industrial piping installation, high-voltage grid integration, and automated switchgear commissioning.',
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Lagos Commercial Tower MEP Complex',
      country: 'Nigeria',
      flag: '🇳🇬',
      category: 'MEP Engineering',
      desc: '22-storey commercial tower HVAC, high-voltage power substation, and fire suppression commissioning.',
      image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Refinery & Fertilizer Structural Fabrication',
      country: 'India / UAE',
      flag: '🇦🇪',
      category: 'Heavy Infrastructure',
      desc: 'Heavy structural steel fabrication, refinery piping networks, and round-the-clock maintenance operations.',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Merald Group — Engineering Excellence & Global Infrastructure</title>
        <meta
          name="description"
          content="Merald Group delivers world-class EPC & MEP Contracting, Integrated Facility Management, Haulify Logistics, and Technical Manpower across Nigeria, India, UAE, Ghana, and Uganda."
        />
      </Helmet>

      {/* ---------------- SECTION 1: TOP HERO VIDEO BANNER (CLEAN, NO OVERLAYS) ---------------- */}
      <section className="relative bg-black w-full h-[65vh] sm:h-[72vh] lg:h-[78vh] overflow-hidden shadow-2xl">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover scale-110 origin-top"
          src={HERO_VIDEO_URL}
        />
      </section>

      {/* ---------------- SECTION 2: HERO CONTENT & GLOBAL OPERATIONS (SHIFTED BELOW VIDEO) ---------------- */}
      <section className="py-16 lg:py-20 bg-white text-navy-900 border-b border-gray-100 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headline, Text & CTAs */}
            <div className="lg:col-span-7 flex flex-col space-y-6">
              <ScrollReveal direction="up" delay={0.1}>
                <div>
                  <Badge variant="teal" className="py-1.5 px-4 text-xs sm:text-sm font-semibold font-heading tracking-wide">
                    Global Infrastructure & Workforce Leaders
                  </Badge>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.2}>
                <Heading level={1} color="navy" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                  Engineering Excellence, Global Infrastructure & Integrated Solutions
                </Heading>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.3}>
                <Text size="large" color="muted" className="text-slate-600 max-w-2xl text-base sm:text-lg leading-relaxed font-body">
                  {t('hero.subtitle', 'A multi-national conglomerate delivering turnkey EPC & MEP contracting, heavy logistics, integrated facility management, and certified technical workforce across West Africa, Middle East, and Asia.')}
                </Text>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.4}>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link to="/services">
                    <Button variant="gradient" size="lg" className="shadow-md font-semibold">
                      Explore Our Services <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button variant="outline" size="lg" className="border-navy-700 text-navy-900 hover:bg-navy-900 hover:text-white font-semibold">
                      Partner With Us
                    </Button>
                  </Link>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.5}>
                <div className="flex flex-wrap items-center gap-6 pt-6 text-xs text-slate-600 font-body border-t border-gray-200">
                  <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600" /> ISO Certified</span>
                  <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-teal-600" /> HSE Standards</span>
                  <span className="flex items-center gap-2"><Globe2 className="w-4 h-4 text-teal-600" /> 5 Active Countries</span>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column: Global Operations Network Widget */}
            <div className="lg:col-span-5 relative">
              <ScrollReveal direction="left" delay={0.3}>
                <div className="bg-navy-900 text-white rounded-2xl p-6 shadow-2xl border border-navy-700 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <Globe2 className="w-6 h-6 text-mint-400" />
                      <span className="font-heading font-bold text-sm text-white">Global Operations Network</span>
                    </div>
                    <span className="text-xs bg-mint-400/20 text-mint-400 px-2.5 py-1 rounded-full font-semibold font-heading">Live Status</span>
                  </div>

                  <div className="space-y-3 font-body text-xs text-gray-200">
                    {COUNTRIES.map((country) => (
                      <Link
                        key={country.slug}
                        to={`/countries/${country.slug}`}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 hover:bg-white/15 transition-colors border border-white/5 hover:border-mint-400/30 group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{country.flag}</span>
                          <div>
                            <p className="font-semibold text-white group-hover:text-mint-400 transition-colors">{country.name}</p>
                            <p className="text-gray-400 text-[11px]">{country.capital} Hub</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-mint-400 font-mono text-[11px] font-semibold">{country.currency}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-mint-400 ml-auto transition-transform group-hover:translate-x-1" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------- SECTION 2: OVERVIEW & QUICK STATS ---------------- */}
      <section className="py-20 bg-neutral-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHead
              eyebrow="Company Overview"
              title="Two Decades of Engineering Leadership"
              lede="Founded in Nigeria in 2005 and now operating globally, Merald Group delivers turnkey infrastructure solutions, technical workforce deployment, and facility stewardship to Tier-1 clients."
            />
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            {/* Unified Full-Width Overview Card Container (Dimmed White) */}
            <div className="w-full bg-slate-50/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-md border border-slate-200/80 hover:shadow-xl transition-all duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/90 gap-6 sm:gap-0">
                
                {/* Stat Item 1 */}
                <div className="flex items-start gap-4 sm:px-6 first:pl-0">
                  <div className="p-3.5 bg-teal-50 text-teal-600 rounded-2xl shrink-0 border border-teal-100 shadow-xs">
                    <Calendar className="w-7 h-7 text-teal-600" />
                  </div>
                  <div>
                    <span className="uppercase tracking-wider text-[11px] font-semibold text-slate-400 block font-body">
                      Industry Experience
                    </span>
                    <Heading level={2} color="navy" className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-0.5">
                      20+ Years
                    </Heading>
                    <p className="text-xs text-slate-500 mt-1 font-body">Established 2005 in Nigeria</p>
                  </div>
                </div>

                {/* Stat Item 2 */}
                <div className="flex items-start gap-4 pt-6 sm:pt-0 sm:px-6">
                  <div className="p-3.5 bg-teal-50 text-teal-600 rounded-2xl shrink-0 border border-teal-100 shadow-xs">
                    <Globe2 className="w-7 h-7 text-teal-600" />
                  </div>
                  <div>
                    <span className="uppercase tracking-wider text-[11px] font-semibold text-slate-400 block font-body">
                      Active Countries
                    </span>
                    <Heading level={2} color="navy" className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-0.5">
                      5+ Nations
                    </Heading>
                    <p className="text-xs text-slate-500 mt-1 font-body">Nigeria, India, UAE, Ghana, Uganda</p>
                  </div>
                </div>

                {/* Stat Item 3 */}
                <div className="flex items-start gap-4 pt-6 sm:pt-0 sm:px-6">
                  <div className="p-3.5 bg-teal-50 text-teal-600 rounded-2xl shrink-0 border border-teal-100 shadow-xs">
                    <Briefcase className="w-7 h-7 text-teal-600" />
                  </div>
                  <div>
                    <span className="uppercase tracking-wider text-[11px] font-semibold text-slate-400 block font-body">
                      Completed Projects
                    </span>
                    <Heading level={2} color="navy" className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-0.5">
                      100+ Projects
                    </Heading>
                    <p className="text-xs text-slate-500 mt-1 font-body">Commercial, Oil & Gas, Power</p>
                  </div>
                </div>

                {/* Stat Item 4 */}
                <div className="flex items-start gap-4 pt-6 sm:pt-0 sm:px-6 last:pr-0">
                  <div className="p-3.5 bg-teal-50 text-teal-600 rounded-2xl shrink-0 border border-teal-100 shadow-xs">
                    <Award className="w-7 h-7 text-teal-600" />
                  </div>
                  <div>
                    <span className="uppercase tracking-wider text-[11px] font-semibold text-slate-400 block font-body">
                      Client Benchmark
                    </span>
                    <Heading level={2} color="navy" className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-0.5">
                      Tier-1 Clients
                    </Heading>
                    <p className="text-xs text-slate-500 mt-1 font-body">ISO Certified & HSE Compliant</p>
                  </div>
                </div>

              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ---------------- SECTION 3: CORE VERTICALS ---------------- */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHead
              eyebrow="Core Capabilities"
              title="Integrated Engineering & Business Verticals"
              lede="End-to-end expertise engineered for multi-national scale, precision execution, and maximum asset longevity."
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {verticals.map((v, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <Card hoverEffect borderAccent className="h-full flex flex-col justify-between p-6 hover:shadow-2xl transition-all duration-300 group">
                  <div>
                    <div className="mb-4 p-3.5 rounded-2xl bg-teal-50/80 border border-teal-100 inline-block group-hover:bg-teal-500 group-hover:text-white transition-all duration-300">
                      {React.cloneElement(v.icon, {
                        className: 'w-8 h-8 text-teal-500 group-hover:text-white transition-colors duration-300',
                      })}
                    </div>
                    <Heading level={3} color="navy" className="text-xl mb-3 group-hover:text-teal-600 transition-colors">
                      {v.title}
                    </Heading>
                    <Text size="regular" color="muted" className="leading-relaxed text-sm">
                      {v.desc}
                    </Text>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <Link
                      to={v.link}
                      className="inline-flex items-center text-sm font-semibold text-navy-900 group-hover:text-teal-600 transition-colors"
                    >
                      Explore Vertical Specs <ArrowRight className="ml-1.5 w-4 h-4 text-teal-500 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- SECTION 4: GLOBAL FOOTPRINT ANIMATED TICKER ---------------- */}
      <section className="py-20 bg-neutral-100 border-t border-b border-gray-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <ScrollReveal>
            <SectionHead
              eyebrow="Global Footprint"
              title="Operating Across 5 Key Industrial Markets"
              lede="Local ground expertise backed by unified international quality, compliance, and management standards."
            />
          </ScrollReveal>
        </div>

        {/* Continuous Animated Flag Marquee (Right-to-Left) */}
        <div className="w-full relative overflow-hidden py-4">
          <div className="animate-marquee flex items-center space-x-6 sm:space-x-8">
            {/* First Set */}
            {COUNTRIES.map((c) => (
              <Link
                key={c.slug}
                to={`/countries/${c.slug}`}
                className="flex items-center gap-4 bg-white px-6 py-4 rounded-2xl shadow-md border border-gray-200/90 hover:border-teal-500/60 hover:shadow-xl transition-all duration-300 group shrink-0"
              >
                <span className="text-4xl sm:text-5xl transform group-hover:scale-110 transition-transform duration-300">
                  {c.flag}
                </span>
                <div>
                  <h4 className="font-heading font-bold text-base sm:text-lg text-navy-900 group-hover:text-teal-600 transition-colors">
                    {c.name}
                  </h4>
                  <p className="text-xs text-gray-500 font-body">{c.capital} Operational Hub</p>
                </div>
                <Badge variant="mint" className="ml-2 text-[11px] font-mono">
                  {c.currency}
                </Badge>
              </Link>
            ))}

            {/* Duplicate Set for Seamless Infinite Loop */}
            {COUNTRIES.map((c) => (
              <Link
                key={`${c.slug}-dup`}
                to={`/countries/${c.slug}`}
                className="flex items-center gap-4 bg-white px-6 py-4 rounded-2xl shadow-md border border-gray-200/90 hover:border-teal-500/60 hover:shadow-xl transition-all duration-300 group shrink-0"
              >
                <span className="text-4xl sm:text-5xl transform group-hover:scale-110 transition-transform duration-300">
                  {c.flag}
                </span>
                <div>
                  <h4 className="font-heading font-bold text-base sm:text-lg text-navy-900 group-hover:text-teal-600 transition-colors">
                    {c.name}
                  </h4>
                  <p className="text-xs text-gray-500 font-body">{c.capital} Operational Hub</p>
                </div>
                <Badge variant="mint" className="ml-2 text-[11px] font-mono">
                  {c.currency}
                </Badge>
              </Link>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 text-center">
          <ScrollReveal delay={0.2}>
            <Link to="/countries">
              <Button variant="outline" size="md">
                <Globe2 className="w-4 h-4 mr-2" /> View Detailed Country Specifications
              </Button>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ---------------- SECTION 5: FEATURED PROJECTS SHOWCASE ---------------- */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHead
              eyebrow="Project Portfolio"
              title="Featured Infrastructure & Industrial Showcase"
              lede="A selection of landmark MEP installations, industrial piping networks, and commercial facility management contracts."
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProjects.map((p, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.15}>
                <Card hoverEffect className="overflow-hidden h-full flex flex-col justify-between p-0 border border-gray-200">
                  <div className="relative h-48 w-full overflow-hidden bg-navy-900">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-navy-900/80 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-body">
                      <span>{p.flag}</span>
                      <span>{p.country}</span>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <Badge variant="mint" className="text-[11px] shadow-sm">{p.category}</Badge>
                    </div>
                  </div>

                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <Heading level={3} color="navy" className="text-lg mb-2">
                        {p.title}
                      </Heading>
                      <Text size="regular" color="muted">
                        {p.desc}
                      </Text>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs text-gray-500 flex items-center gap-1 font-body">
                        <Layers className="w-3.5 h-3.5 text-teal-500" /> Key Milestone Project
                      </span>
                      <Link to="/contact" className="text-xs font-semibold text-navy-900 hover:text-teal-500 transition-colors">
                        Inquire Details →
                      </Link>
                    </div>
                  </div>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- SECTION 6: CLOSING CTA BANNER ---------------- */}
      <section className="py-20 bg-gradient-to-r from-navy-900 via-navy-700 to-teal-500 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <ScrollReveal>
            <SectionHead
              eyebrow="Commercial Collaboration"
              title="Ready to Partner with Merald Group?"
              lede="Whether you require turnkey MEP contracting, site facility management, or qualified technical manpower, our regional engineering directors are standing by."
              inverted
            />
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link to="/contact">
                <Button variant="gradient" size="lg" className="shadow-xl bg-white text-navy-900 hover:bg-neutral-100 border-none font-bold">
                  Partner With Us <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/jobs">
                <Button variant="outline" size="lg" className="text-white border-white/40 hover:bg-white/10 font-semibold">
                  Explore Career Openings
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
};

export default Home;
