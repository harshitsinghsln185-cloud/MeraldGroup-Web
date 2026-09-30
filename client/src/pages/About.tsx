import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ShieldCheck,
  Target,
  HeartHandshake,
  Compass,
  Eye,
  ArrowRight,
  CheckCircle2,
  Building,
  UserCheck,
} from 'lucide-react';
import { Heading, Text } from '../components/ui/Typography';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SectionHead } from '../components/ui/SectionHead';
import { ScrollReveal } from '../components/ui/ScrollReveal';

export const About: React.FC = () => {
  const coreValues = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-teal-500" />,
      title: 'Safety First (HSE)',
      desc: 'Zero-harm safety policy across all active site deployments, logistics fleets, and cleanroom facility operations backed by ISO 45001 compliance.',
    },
    {
      icon: <Target className="w-8 h-8 text-teal-500" />,
      title: 'Integrity & Compliance',
      desc: 'Uncompromising corporate governance, transparent client partnerships, ethical labor practices, and regulatory compliance in every operating nation.',
    },
    {
      icon: <HeartHandshake className="w-8 h-8 text-teal-500" />,
      title: 'Client Partnership',
      desc: 'Long-term client relationships rooted in technical precision, 24/7 technical availability, and continuous asset performance optimization.',
    },
  ];

  const milestones = [
    {
      year: '2005',
      title: 'Inception in Nigeria under Mr. Yogendra Singh',
      desc: 'Founded in Lagos, Nigeria as a specialist MEP engineering and electrical contracting firm serving West Africa commercial infrastructure.',
    },
    {
      year: '2010–2018',
      title: 'West Africa Expansion & India Hub',
      desc: 'Expanded MEP & IFM contracts into Ghana, established India operational and engineering design centers in Delhi and Gurgaon.',
    },
    {
      year: '2021',
      title: 'Middle East, East Africa & Logistics',
      desc: 'Launched Dubai IFM regional hub, expanded into Uganda power grids, and introduced Haulify Heavy Logistics and Manpower divisions.',
    },
  ];

  const leadershipTeam = [
    {
      name: 'Mr. Yogendra Singh',
      title: 'Founder & Chairman',
      bio: 'Founded Merald Group in Nigeria in 2005. Over 25 years of visionary leadership guiding multi-national engineering and infrastructure expansion.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Sudhanshu Gaurav',
      title: 'Managing Director & Executive Leadership',
      bio: 'Spearheads global EPC contracting, strategic corporate partnerships, and operational governance across West Africa, Asia, and the Middle East.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Ujjwal Singh',
      title: 'Director of Operations & Business Strategy',
      bio: 'Directs Haulify logistics fleets, IFM maintenance divisions, and international technical workforce recruitment and cross-border deployment.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    },
  ];

  return (
    <>
      <Helmet>
        <title>About Us — Merald Group Story, Values & Executive Leadership</title>
        <meta
          name="description"
          content="Learn about Merald Group's story from 2005 inception in Nigeria under Mr. Yogendra Singh to a multi-national engineering conglomerate. Core values, leadership team, and heritage timeline."
        />
      </Helmet>

      {/* ---------------- SECTION 1: HERO SECTION ---------------- */}
      <section className="relative w-full py-24 bg-transparent text-white overflow-hidden">
        {/* Hero Background Image Placeholder - Replace src URL when needed */}
        <img
          src="https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=1920&q=80"
          alt="About Hero Background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-navy-900/60 z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ScrollReveal direction="up">
            <Badge variant="mint" className="mb-4 px-4 py-1.5 text-xs sm:text-sm font-semibold tracking-wide shadow-md">
              Corporate Heritage & Profile
            </Badge>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.1}>
            <Heading level={1} color="white" align="center" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 tracking-tight text-white drop-shadow-sm">
              About Merald Group
            </Heading>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <Text size="large" color="white" align="center" className="max-w-3xl mx-auto text-white opacity-95 text-base sm:text-lg leading-relaxed font-body drop-shadow-xs">
              A multi-national conglomerate delivering world-class EPC & MEP contracting, integrated facility management, heavy haulage logistics, and technical workforce solutions.
            </Text>
          </ScrollReveal>
        </div>
      </section>

      {/* ---------------- SECTION 2: WHO WE ARE SECTION ---------------- */}
      <section className="py-20 bg-neutral-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7">
              <ScrollReveal direction="up">
                <SectionHead
                  eyebrow="Who We Are"
                  title="Rooted in Nigeria in 2005, Built for Global Reach"
                  lede="Founded in Nigeria in 2005 by Mr. Yogendra Singh, Merald Group has evolved from a premier MEP contractor into a multi-disciplinary international conglomerate."
                  align="left"
                />
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.2}>
                <div className="space-y-4 font-body text-sm sm:text-base text-neutral-700 leading-relaxed">
                  <p>
                    Over the past two decades, Merald Group has established a reputation for engineering excellence across commercial high-rises, industrial refineries, power substations, and logistics hubs.
                  </p>
                  <p>
                    Today, with operational command centers spanning <strong>Nigeria, India, UAE, Ghana, and Uganda</strong>, we combine deep local ground expertise with unified international quality standards, ISO safety certifications, and robust workforce logistics.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 mt-6 border-t border-gray-200">
                  <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-2xs">
                    <p className="font-heading font-extrabold text-xl text-navy-900">2005</p>
                    <p className="text-xs text-neutral-500 font-body">Nigeria Inception</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-2xs">
                    <p className="font-heading font-extrabold text-xl text-navy-900">5 Nations</p>
                    <p className="text-xs text-neutral-500 font-body">Operating Footprint</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-2xs col-span-2 sm:col-span-1">
                    <p className="font-heading font-extrabold text-xl text-navy-900">6,400+</p>
                    <p className="text-xs text-neutral-500 font-body">Technical Workforce</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Who We Are Visual Image */}
            <div className="lg:col-span-5">
              <ScrollReveal direction="left" delay={0.2}>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 group">
                  <img
                    src="https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80"
                    alt="Merald Engineering Operations"
                    className="w-full h-[420px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/30 to-transparent flex flex-col justify-end p-6">
                    <Badge variant="mint" className="w-fit mb-2">Multi-Disciplinary Scale</Badge>
                    <Heading level={3} color="white" className="text-xl">Engineering Infrastructure</Heading>
                    <Text size="small" color="white" className="opacity-90">MEP, IFM, Logistics & Technical Workforce</Text>
                  </div>
                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------- SECTION 3: MISSION & VISION SECTION ---------------- */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHead
              eyebrow="Strategic Intent"
              title="Our Mission & Vision Statements"
              lede="Guided by purpose and committed to sustainable, high-precision engineering development."
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission Card */}
            <ScrollReveal direction="up" delay={0.1}>
              <Card hoverEffect borderAccent className="p-8 h-full bg-neutral-100 flex flex-col justify-between border border-gray-200">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-teal-50">
                      <Compass className="w-7 h-7 text-teal-500" />
                    </div>
                    <Badge variant="navy">Our Core Mission</Badge>
                  </div>

                  <Heading level={3} color="navy" className="text-2xl mb-4">
                    Infrastructure Resiliency & Technical Precision
                  </Heading>

                  <Text size="regular" color="muted" className="leading-relaxed font-body">
                    To construct and manage resilient commercial and industrial infrastructure through turnkey EPC & MEP contracting, sustainable facility stewardship, and empowered technical workforce deployment across emerging and global markets.
                  </Text>
                </div>

                <div className="pt-4 border-t border-gray-200 mt-6 flex items-center gap-2 text-xs font-semibold text-teal-500 font-body">
                  <CheckCircle2 className="w-4 h-4" /> Uncompromising Quality & Safety
                </div>
              </Card>
            </ScrollReveal>

            {/* Vision Card */}
            <ScrollReveal direction="up" delay={0.2}>
              <Card hoverEffect borderAccent className="p-8 h-full bg-neutral-100 flex flex-col justify-between border border-gray-200">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-teal-50">
                      <Eye className="w-7 h-7 text-teal-500" />
                    </div>
                    <Badge variant="teal">Our Global Vision</Badge>
                  </div>

                  <Heading level={3} color="navy" className="text-2xl mb-4">
                    The Benchmark Multi-Disciplinary Partner
                  </Heading>

                  <Text size="regular" color="muted" className="leading-relaxed font-body">
                    To be recognized globally as the premier multi-disciplinary infrastructure conglomerate across West Africa, the Middle East, and Asia, celebrated for unyielding HSE standards, client partnership, and operational excellence.
                  </Text>
                </div>

                <div className="pt-4 border-t border-gray-200 mt-6 flex items-center gap-2 text-xs font-semibold text-teal-500 font-body">
                  <CheckCircle2 className="w-4 h-4" /> Benchmark Operations Standards
                </div>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ---------------- SECTION 4: HERITAGE TIMELINE SECTION ---------------- */}
      <section className="py-20 bg-neutral-100 border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHead
              eyebrow="Milestones & Journey"
              title="Heritage Timeline: 2005 to Present"
              lede="Two decades of continuous expansion, technical diversification, and landmark project achievements."
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {milestones.map((m, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.15}>
                <Card borderAccent className="p-8 h-full bg-white flex flex-col justify-between relative shadow-sm">
                  <div>
                    <span className="font-heading font-extrabold text-3xl sm:text-4xl text-teal-500 block mb-3">
                      {m.year}
                    </span>
                    <Heading level={4} color="navy" className="text-xl mb-3">
                      {m.title}
                    </Heading>
                    <Text size="small" color="muted" className="leading-relaxed">
                      {m.desc}
                    </Text>
                  </div>

                  <div className="pt-4 border-t border-gray-100 mt-6">
                    <span className="text-xs font-semibold text-gray-500 font-body flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-teal-500" /> Milestone Phase
                    </span>
                  </div>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- SECTION 5: CORE VALUES SECTION (3 CARDS) ---------------- */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHead
              eyebrow="Guiding Principles"
              title="Our Core Values"
              lede="The foundational standards governing every project, site deployment, and client engagement."
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValues.map((v, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <Card hoverEffect borderAccent className="p-8 h-full bg-neutral-100 border border-gray-200 flex flex-col justify-between">
                  <div>
                    <div className="p-3 rounded-xl bg-teal-50 inline-block mb-4">{v.icon}</div>
                    <Heading level={3} color="navy" className="text-xl mb-3">
                      {v.title}
                    </Heading>
                    <Text size="regular" color="muted" className="leading-relaxed">
                      {v.desc}
                    </Text>
                  </div>
                  <div className="pt-4 border-t border-gray-200 mt-6">
                    <span className="text-xs font-semibold text-teal-500 font-body flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Fully Enforced Corporate Standard
                    </span>
                  </div>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- SECTION 6: LEADERSHIP SECTION ---------------- */}
      <section className="py-20 bg-neutral-100 border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHead
              eyebrow="Executive Governance"
              title="Executive Leadership Team"
              lede="Guided by veteran engineering pioneers and strategic directors."
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadershipTeam.map((leader, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.15}>
                <Card hoverEffect borderAccent className="p-6 h-full bg-white flex flex-col justify-between border border-gray-200">
                  <div>
                    {/* Avatar Image */}
                    <div className="relative w-28 h-28 rounded-full overflow-hidden mx-auto mb-4 border-2 border-teal-500 shadow-md">
                      <img
                        src={leader.avatar}
                        alt={leader.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <Heading level={3} color="navy" align="center" className="text-xl mb-1">
                      {leader.name}
                    </Heading>

                    <Text size="small" color="teal" align="center" weight="semibold" className="mb-4">
                      {leader.title}
                    </Text>

                    <Text size="small" color="muted" align="center" className="leading-relaxed">
                      {leader.bio}
                    </Text>
                  </div>

                  <div className="pt-4 border-t border-gray-100 mt-6 text-center">
                    <span className="text-xs text-navy-900 font-semibold font-body inline-flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-teal-500" /> Executive Officer
                    </span>
                  </div>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- SECTION 7: CLOSING CTA SECTION ---------------- */}
      <section className="py-20 bg-gradient-to-r from-navy-900 via-navy-700 to-teal-500 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <ScrollReveal>
            <SectionHead
              eyebrow="Get In Touch"
              title="Partner With Merald Group Today"
              lede="Discover how our engineering solutions, logistics fleets, and technical workforce can elevate your next project."
              inverted
            />
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link to="/contact">
                <Button variant="gradient" size="lg" className="shadow-xl bg-white text-navy-900 hover:bg-neutral-100 border-none font-bold">
                  Contact Commercial Team <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/jobs">
                <Button variant="outline" size="lg" className="text-white border-white/40 hover:bg-white/10 font-semibold">
                  Explore Career Opportunities
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
};

export default About;
