import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Globe, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { Heading, Text } from '../components/ui/Typography';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SectionHead } from '../components/ui/SectionHead';
import { ScrollReveal } from '../components/ui/ScrollReveal';

import { COUNTRY_DATA } from '../data/countryData';

export const Countries: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Global Footprint — Local Ground Expertise, International Standards</title>
        <meta
          name="description"
          content="Explore Merald Group operations across Nigeria, India, UAE, Ghana, and Uganda. Regional hubs, local stats, and infrastructure specs."
        />
      </Helmet>

      {/* ---------------- SECTION 1: HERO SECTION ---------------- */}
      <section className="relative w-full py-28 sm:py-36 lg:py-40 min-h-[55vh] flex items-center justify-center bg-transparent text-white overflow-hidden shadow-md">
        {/* Background Image with clockwise rotation & reduced zoom */}
        <img
          src="/globalfootprint.webp"
          alt="Global Footprint Hero Background"
          className="absolute inset-0 w-full h-full object-cover scale-90 rotate-2 transition-transform duration-700 z-0"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/70 via-sky-900/50 to-blue-950/70 z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ScrollReveal direction="up">
            <SectionHead
              eyebrow="Global Footprint"
              title="Local Ground Expertise, International Standards"
              lede="Operational command centers delivering tailored engineering solutions, regulatory compliance, and localized workforce management across 5 key industrial hubs."
              inverted
            />
          </ScrollReveal>
        </div>
      </section>

      {/* ---------------- SECTION 2: COUNTRIES GRID OVERVIEW ---------------- */}
      <section className="py-20 bg-neutral-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {COUNTRY_DATA.map((country, idx) => (
              <ScrollReveal key={country.slug} delay={idx * 0.1}>
                <Link
                  to={`/countries/${country.slug}`}
                  className="group block h-full focus:outline-none"
                >
                  <Card hoverEffect borderAccent className="p-0 overflow-hidden h-full flex flex-col justify-between bg-white border border-gray-200">
                    {/* Country Card Top Image */}
                    <div className="relative h-56 sm:h-60 w-full overflow-hidden bg-navy-900">
                      <img
                        src={country.cardImage}
                        alt={`${country.name} Merald Operations`}
                        className="w-full h-full object-cover object-top transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/30 to-transparent" />
                      <div className="absolute bottom-3 left-4 flex items-center gap-2 text-white">
                        <span className="text-4xl">{country.flag}</span>
                        <div>
                          <Heading level={3} color="white" className="text-xl mb-0">
                            {country.name}
                          </Heading>
                          <p className="text-xs text-mint-400 font-body">{country.capital} Hub</p>
                        </div>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge variant="teal" className="text-[11px] shadow-sm">{country.currency}</Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <Text size="small" color="primary" weight="medium" className="mb-4 leading-relaxed line-clamp-2">
                          {country.focusOneLiner}
                        </Text>

                        {/* Quick Office Badge */}
                        <div className="space-y-2 mb-6 text-xs font-body text-neutral-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                            <span className="truncate">{country.localOffice.address}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-teal-500 shrink-0" />
                            <span>ISO & HSE Verified Operations</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs text-navy-900 font-semibold flex items-center gap-1 font-body">
                          <Globe className="w-3.5 h-3.5 text-teal-500" /> Operating Region
                        </span>
                        <span className="inline-flex items-center text-xs sm:text-sm font-bold text-teal-500 group-hover:text-navy-900 transition-colors font-body">
                          Country Specifications <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- SECTION 3: CLOSING BRAND-GRADIENT CTA SECTION ---------------- */}
      <section className="py-20 bg-gradient-to-r from-navy-900 via-navy-700 to-teal-500 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <ScrollReveal>
            <SectionHead
              eyebrow="Cross-Border Capabilities"
              title="Expand Your Infrastructure Across Active Hubs"
              lede="Our regional project directors provide localized RFP evaluations, legal compliance guidance, and rapid site workforce mobilization."
              inverted
            />
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link to="/contact">
                <Button variant="gradient" size="lg" className="shadow-xl bg-white text-navy-900 hover:bg-neutral-100 border-none font-bold">
                  Contact Regional Offices <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="lg" className="text-white border-white/40 hover:bg-white/10 font-semibold">
                  View Full Services List
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
};

export default Countries;
