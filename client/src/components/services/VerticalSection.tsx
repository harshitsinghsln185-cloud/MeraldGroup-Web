import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import type { VerticalData } from '../../data/servicesData';
import { Heading, Text } from '../ui/Typography';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ScrollReveal } from '../ui/ScrollReveal';

export interface VerticalSectionProps {
  data: VerticalData;
}

export const VerticalSection: React.FC<VerticalSectionProps> = ({ data }) => {
  const isReversed = data.reversed ?? false;
  const isNeutralBg = data.bgVariant === 'neutral';

  const sectionBgClass = isNeutralBg
    ? 'py-20 bg-neutral-100 border-b border-gray-200 scroll-mt-20'
    : 'py-20 bg-white border-b border-gray-100 scroll-mt-20';

  const detailsColClass = isReversed
    ? 'lg:col-span-7 order-1 lg:order-2 space-y-6'
    : 'lg:col-span-7 space-y-6';

  const highlightColClass = isReversed
    ? 'lg:col-span-5 order-2 lg:order-1'
    : 'lg:col-span-5';

  return (
    <section id={data.id} className={sectionBgClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Details Column */}
          <div className={detailsColClass}>
            <ScrollReveal direction="up">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl border border-teal-100 shadow-xs">
                  {data.mainIcon}
                </div>
                <div>
                  <Badge variant={data.badgeVariant} className="text-xs font-semibold font-heading tracking-wide">
                    {data.badgeText}
                  </Badge>
                  <p className="text-xs text-slate-500 font-body mt-0.5">{data.verticalNumber}</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.1}>
              <Heading level={2} color="navy" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                {data.title}
              </Heading>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.15}>
              <Text size="large" color="teal" className="font-semibold text-base sm:text-lg">
                {data.subtitle}
              </Text>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <Text size="regular" color="muted" className="leading-relaxed text-slate-600 text-sm sm:text-base font-body">
                {data.description}
              </Text>
            </ScrollReveal>

            {/* Sub-services Grid / List */}
            {data.subServices && data.subServices.length > 0 && (
              <ScrollReveal direction="up" delay={0.25}>
                {data.id === 'ifm' ? (
                  <div className="space-y-3 pt-2">
                    {data.subServices.map((sub, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-gray-200/80 shadow-2xs">
                        {sub.icon}
                        <div>
                          <h5 className="font-bold text-navy-900 text-sm font-heading">{sub.title}</h5>
                          <p className="text-xs text-slate-500 mt-0.5 font-body">{sub.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {data.subServices.map((sub, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl border ${
                          isNeutralBg ? 'bg-white border-gray-200/80' : 'bg-slate-50 border-slate-200/80'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          {sub.icon}
                          <h4 className="font-bold text-navy-900 text-sm font-heading">{sub.title}</h4>
                        </div>
                        <p className="text-xs text-slate-600 font-body">{sub.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollReveal>
            )}

            <ScrollReveal direction="up" delay={0.3}>
              <div className="pt-2">
                <Link to={data.ctaLink}>
                  <Button variant={data.ctaVariant || 'gradient'} size="md">
                    {data.ctaText} <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>

          {/* Highlight / Visual Box Column */}
          <div className={highlightColClass}>
            <ScrollReveal direction={isReversed ? 'right' : 'left'} delay={0.2}>
              {data.id === 'epc-mep' && (
                <div className="bg-navy-900 text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden border border-navy-700">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                    <span className="text-xs uppercase tracking-wider text-mint-400 font-heading font-semibold">
                      {data.highlightBox.label}
                    </span>
                    <Badge variant="mint" className="text-[11px]">
                      {data.highlightBox.badgeText}
                    </Badge>
                  </div>

                  <Heading level={3} color="white" className="text-xl mb-4">
                    {data.highlightBox.title}
                  </Heading>

                  {data.highlightBox.items && (
                    <ul className="space-y-3.5 text-xs text-gray-200 font-body">
                      {data.highlightBox.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <CheckCircle className="w-4 h-4 text-mint-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {data.highlightBox.footerLabel && (
                    <div className="mt-8 pt-6 border-t border-white/10 bg-white/5 -mx-8 -mb-8 p-6 rounded-b-2xl flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400">{data.highlightBox.footerLabel}</p>
                        <p className="text-sm font-bold text-white font-heading mt-0.5">
                          {data.highlightBox.footerValue}
                        </p>
                      </div>
                      <div className="text-mint-400/40">{data.mainIcon}</div>
                    </div>
                  )}
                </div>
              )}

              {data.id === 'ifm' && (
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 relative">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                    <span className="text-xs uppercase tracking-wider text-teal-600 font-heading font-semibold">
                      {data.highlightBox.label}
                    </span>
                    <Badge variant="teal" className="text-[11px]">
                      {data.highlightBox.badgeText}
                    </Badge>
                  </div>

                  <Heading level={3} color="navy" className="text-xl mb-4">
                    {data.highlightBox.title}
                  </Heading>

                  <div className="space-y-4 font-body text-xs text-slate-600">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
                      <p className="font-bold text-navy-900 text-sm font-heading">Computerized Maintenance (CMMS)</p>
                      <p className="text-slate-500 mt-1">Automated preventive work-orders, inventory tracking, and equipment maintenance history.</p>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
                      <p className="font-bold text-navy-900 text-sm font-heading">Round-the-Clock Rapid Dispatch</p>
                      <p className="text-slate-500 mt-1">Dedicated mobile MEP engineers available 24/7/365 for emergency power or utility restoration.</p>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
                      <p className="font-bold text-navy-900 text-sm font-heading">HSE & ISO Certified Upkeep</p>
                      <p className="text-slate-500 mt-1">Environmental health, safety compliance, indoor air quality testing, and cleanroom maintenance.</p>
                    </div>
                  </div>
                </div>
              )}

              {data.id === 'distribution' && (
                <div className="bg-navy-900 text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden border border-navy-700">
                  <span className="text-xs uppercase tracking-wider text-mint-400 font-heading font-semibold block mb-2">
                    {data.highlightBox.label}
                  </span>
                  <Heading level={3} color="white" className="text-xl mb-4">
                    {data.highlightBox.title}
                  </Heading>
                  <Text size="small" color="white" className="text-gray-300 opacity-90 leading-relaxed font-body mb-6">
                    Our direct OEM partnerships eliminate middleman inflation, guaranteeing authentic components, factory testing certificates, and fast delivery to site.
                  </Text>
                  
                  <div className="space-y-3 font-body text-xs border-t border-white/10 pt-4 text-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-mint-400 font-bold">Lagos Hub, Nigeria</span>
                      <span className="text-gray-400">West Africa Logistics</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-mint-400 font-bold">Dubai Hub, UAE</span>
                      <span className="text-gray-400">Middle East Distribution</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-mint-400 font-bold">Mumbai Hub, India</span>
                      <span className="text-gray-400">South Asia Sourcing</span>
                    </div>
                  </div>
                </div>
              )}

              {data.id === 'haulify' && (
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 relative">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                    <span className="text-xs uppercase tracking-wider text-teal-600 font-heading font-semibold">
                      {data.highlightBox.label}
                    </span>
                    <Badge variant="mint" className="text-[11px]">
                      {data.highlightBox.badgeText}
                    </Badge>
                  </div>

                  <Heading level={3} color="navy" className="text-xl mb-4">
                    {data.highlightBox.title}
                  </Heading>

                  <div className="space-y-3 font-body text-xs text-slate-600">
                    <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between">
                      <span className="font-semibold text-navy-900">OOG Machinery Transport</span>
                      <div className="text-teal-600"><CheckCircle className="w-4 h-4" /></div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between">
                      <span className="font-semibold text-navy-900">GPS Telemetry Tracking</span>
                      <div className="text-teal-600"><CheckCircle className="w-4 h-4" /></div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between">
                      <span className="font-semibold text-navy-900">Port-to-Site Mobilization</span>
                      <div className="text-teal-600"><CheckCircle className="w-4 h-4" /></div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between">
                      <span className="font-semibold text-navy-900">Rigging & Crane Erection</span>
                      <div className="text-teal-600"><CheckCircle className="w-4 h-4" /></div>
                    </div>
                  </div>
                </div>
              )}

              {data.id === 'manpower' && (
                <div className="bg-navy-900 text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden border border-navy-700">
                  <span className="text-xs uppercase tracking-wider text-mint-400 font-heading font-semibold block mb-2">
                    {data.highlightBox.label}
                  </span>
                  <Heading level={3} color="white" className="text-xl mb-4">
                    {data.highlightBox.title}
                  </Heading>
                  <p className="text-xs text-gray-300 font-body leading-relaxed mb-6">
                    Our workforce database contains thousands of trade-tested personnel equipped with medical fitness clearances and country-specific work permits.
                  </p>
                  
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-300">Active Countries:</span>
                      <span className="text-mint-400 font-bold font-heading">Nigeria, India, UAE, Ghana, Uganda</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-300">Safety Compliance:</span>
                      <span className="text-mint-400 font-bold font-heading">Zero Incident Record</span>
                    </div>
                  </div>
                </div>
              )}
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
};

export default VerticalSection;
