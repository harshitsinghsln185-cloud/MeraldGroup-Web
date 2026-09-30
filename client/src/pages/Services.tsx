import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Heading, Text } from '../components/ui/Typography';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SectionHead } from '../components/ui/SectionHead';
import { ScrollReveal } from '../components/ui/ScrollReveal';

import {
  SERVICES_DATA,
  WHY_CHOOSE_DATA,
  QUICK_LINKS_DATA,
} from '../data/servicesData';
import { VerticalSection } from '../components/services/VerticalSection';
import { WhyChooseCard } from '../components/services/WhyChooseCard';

export const Services: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Services — Merald Group | EPC, MEP, IFM, Logistics & Manpower</title>
        <meta
          name="description"
          content="Explore Merald Group's 5 core business verticals: EPC/MEP Contracting, IFM, Distribution, Haulify Heavy Logistics, and Global Technical Manpower across Nigeria, India, UAE, Ghana, and Uganda."
        />
      </Helmet>

      {/* ---------------- HERO BANNER ---------------- */}
      <section className="relative w-full py-20 lg:py-24 bg-transparent text-white overflow-hidden">
        {/* Background Image */}
        <img
          src="/service.webp"
          alt="Services Hero Background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-navy-900/50 z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ScrollReveal direction="up" delay={0.1}>
            <div className="flex justify-center mb-4">
              <Badge variant="mint" className="px-4 py-1.5 text-xs sm:text-sm font-semibold tracking-wide shadow-md">
                Integrated Business Verticals
              </Badge>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <Heading level={1} color="white" align="center" className="mb-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Engineering Excellence & Global Capabilities
            </Heading>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.3}>
            <Text size="large" color="white" align="center" className="max-w-3xl mx-auto text-gray-200 opacity-95 text-base sm:text-lg leading-relaxed font-body">
              Delivering turnkey engineering contracting, facility stewardship, heavy equipment haulage, direct OEM distribution, and certified technical workforce across West Africa, Middle East, and Asia.
            </Text>
          </ScrollReveal>

          {/* Jump / Quick Anchor Navigation */}
          <ScrollReveal direction="up" delay={0.4}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {QUICK_LINKS_DATA.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs sm:text-sm font-medium text-white transition-all duration-200 backdrop-blur-xs group"
                >
                  <span className="text-mint-400 group-hover:scale-110 transition-transform">{link.icon}</span>
                  <span>{link.name}</span>
                </a>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ---------------- 5 BUSINESS VERTICALS ---------------- */}
      {SERVICES_DATA.map((vertical) => (
        <VerticalSection key={vertical.id} data={vertical} />
      ))}

      {/* ---------------- SECTION: WHY CHOOSE MERALD GROUP? ---------------- */}
      <section id="why-choose-merald" className="py-20 lg:py-24 bg-neutral-50 border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <SectionHead
              eyebrow="The Merald Advantage"
              title="Why Choose Merald Group?"
              lede="We combine turnkey engineering execution, direct OEM distribution, in-house logistics, and global technical talent to deliver unmatched project speed, safety, and reliability."
            />
          </ScrollReveal>

          {/* 6 Key Facility & Service Pillar Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {WHY_CHOOSE_DATA.map((pillar, idx) => (
              <WhyChooseCard key={pillar.id} data={pillar} delay={0.1 * (idx + 1)} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- BOTTOM CTA BANNER ---------------- */}
      <section className="py-16 bg-neutral-100 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal direction="up">
            <Badge variant="mint" className="mb-3 px-3.5 py-1 text-xs font-semibold">Partner With Us</Badge>
            <Heading level={2} color="navy" align="center" className="text-2xl sm:text-3xl font-extrabold mb-4">
              Ready to Elevate Your Engineering Infrastructure?
            </Heading>
            <Text size="large" color="muted" align="center" className="max-w-2xl mx-auto text-slate-600 mb-8 text-sm sm:text-base">
              Contact our engineering and capabilities team today to discuss project specifications, equipment distribution, or technical workforce requirements.
            </Text>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/contact">
                <Button variant="gradient" size="lg" className="shadow-md">
                  Request Capabilities Proposal <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/jobs">
                <Button variant="outline" size="lg" className="border-navy-700 text-navy-900 hover:bg-navy-900 hover:text-white">
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

export default Services;
