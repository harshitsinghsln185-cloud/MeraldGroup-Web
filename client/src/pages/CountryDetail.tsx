import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Globe,
  UserCheck,
  ArrowRight,
} from 'lucide-react';
import { Heading, Text } from '../components/ui/Typography';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SectionHead } from '../components/ui/SectionHead';
import { ScrollReveal } from '../components/ui/ScrollReveal';

import { type CountryData, getCountryBySlug } from '../data/countryData';

export const CountryDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [country, setCountry] = useState<CountryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      const foundCountry = getCountryBySlug(slug);
      if (foundCountry) {
        setCountry(foundCountry);
        setError(null);
      } else {
        setError('Operating Region Not Found');
      }
    } else {
      setError('Invalid country parameter');
    }
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="py-24 text-center text-neutral-500 font-body">
        <Text size="large" align="center">Loading Country Specifications...</Text>
      </div>
    );
  }

  if (error || !country) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-4 font-body">
        <Heading level={2} color="navy" align="center" className="mb-4">Operating Region Not Found</Heading>
        <Text color="muted" align="center" className="mb-6">The requested country specification page could not be located.</Text>
        <Link to="/countries">
          <Button variant="primary" size="md"><ArrowLeft className="mr-2 w-4 h-4" /> Return to Global Footprint</Button>
        </Link>
      </div>
    );
  }

  // JSON-LD Structured Data Schema for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `Merald Group ${country.name}`,
    description: country.metaDescription,
    address: {
      '@type': 'PostalAddress',
      streetAddress: country.localOffice.address,
      addressCountry: country.name,
    },
    telephone: country.localOffice.phone,
    email: country.localOffice.email,
  };

  return (
    <>
      {/* ---------------- SEO SETUP ---------------- */}
      <Helmet>
        <title>{country.metaTitle}</title>
        <meta name="description" content={country.metaDescription} />
        <meta property="og:title" content={country.metaTitle} />
        <meta property="og:description" content={country.metaDescription} />
        <meta property="og:type" content="business.business" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      {/* ---------------- SECTION 1: HERO BANNER (CLEAN COUNTRY BANNER IMAGE) ---------------- */}
      <section className="relative w-full h-[300px] sm:h-[400px] lg:h-[450px] bg-navy-900 overflow-hidden">
        <img
          src={country.heroImage}
          alt={`Merald Operations in ${country.name}`}
          className="w-full h-full object-cover object-top"
        />
      </section>

      {/* ---------------- SECTION 2: HIGHLIGHTS & TRUST STATS PANEL ---------------- */}
      <section className="py-16 bg-neutral-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <ScrollReveal>
            <SectionHead
              eyebrow="Key Performance Metrics"
              title={`Trust & Capabilities in ${country.name}`}
              lede={`Verified operational metrics and infrastructure deployment benchmarks for ${country.name}.`}
            />
          </ScrollReveal>

          {/* Key Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {country.stats.map((s, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.1}>
                <Card borderAccent className="bg-white p-6 text-center">
                  <Text size="small" color="muted" weight="medium" align="center">{s.label}</Text>
                  <Heading level={2} color="navy" align="center" className="text-3xl font-extrabold mt-1">
                    {s.value}
                  </Heading>
                </Card>
              </ScrollReveal>
            ))}
          </div>

          {/* Regional Specs Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Overview & Key Projects */}
            <div className="lg:col-span-8 space-y-8">
              <ScrollReveal>
                <Card className="bg-white p-8 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3 text-teal-500">
                    <Globe className="w-5 h-5" />
                    <Heading level={3} color="navy">Regional Ground Operations</Heading>
                  </div>
                  <Text size="regular" color="primary" className="leading-relaxed font-body mb-4">
                    {country.overviewText}
                  </Text>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-neutral-600 font-body pt-3 border-t border-gray-100">
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-teal-500" /> ISO Certified</span>
                    <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-teal-500" /> Local Labor Compliant</span>
                    <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4 text-teal-500" /> Tier-1 Infrastructure</span>
                  </div>
                </Card>
              </ScrollReveal>

              {/* Key Projects */}
              <ScrollReveal delay={0.2}>
                <div>
                  <Heading level={3} color="navy" className="mb-4 text-xl">
                    Featured Landmark Projects in {country.name}
                  </Heading>
                  <div className="space-y-4">
                    {country.keyProjects.map((p, i) => (
                      <Card key={i} hoverEffect className="bg-white p-6 border border-gray-200">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <Heading level={4} color="navy" className="text-lg mb-0">{p.title}</Heading>
                          <Badge variant="teal">{p.category}</Badge>
                        </div>
                        <Text size="regular" color="muted" className="leading-relaxed">{p.description}</Text>
                      </Card>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Local Office Card */}
            <div className="lg:col-span-4 space-y-6">
              <ScrollReveal delay={0.2}>
                <Card className="bg-navy-900 text-white p-8 shadow-xl">
                  <div className="flex items-center gap-3 mb-4 text-mint-400">
                    <Building2 className="w-6 h-6" />
                    <Heading level={3} color="white" className="text-xl">Local Hub Office</Heading>
                  </div>

                  <div className="space-y-4 font-body text-sm text-gray-200 mb-6 border-t border-white/10 pt-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-mint-400 shrink-0 mt-0.5" />
                      <span>{country.localOffice.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-mint-400 shrink-0" />
                      <span>{country.localOffice.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-mint-400 shrink-0" />
                      <span>{country.localOffice.email}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-white/10 rounded-xl border border-white/15 mb-6">
                    <div className="flex items-center gap-2 text-xs font-semibold text-mint-400 font-body mb-1">
                      <UserCheck className="w-4 h-4" /> Regional Director Contact
                    </div>
                    <p className="text-xs text-gray-300 font-body">
                      For local tenders, sub-contracts, and manpower inquiries in {country.name}.
                    </p>
                  </div>

                  <Link to="/contact">
                    <Button variant="gradient" size="sm" className="w-full justify-center font-bold">
                      Submit RFP for {country.name} <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </Card>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------- SECTION 3: MAP SECTION FOR THIS COUNTRY ---------------- */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHead
              eyebrow="Interactive Map"
              title={`${country.name} Operations Location`}
              lede={`Find our regional hub office and project management center in ${country.capital}, ${country.name}.`}
            />
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-xl h-96 w-full">
              <iframe
                title={`Merald Group ${country.name} Office Map`}
                src={country.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ---------------- SECTION 4: CLOSING BRAND-GRADIENT CTA SECTION ---------------- */}
      <section className="py-20 bg-gradient-to-r from-navy-900 via-navy-700 to-teal-500 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <ScrollReveal>
            <SectionHead
              eyebrow="Initiate Partnership"
              title={`Execute Your Next Project in ${country.name}`}
              lede={`Contact our ${country.name} operational leadership for RFP proposals, vendor registration, or site workforce deployment.`}
              inverted
            />
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link to="/contact">
                <Button variant="gradient" size="lg" className="shadow-xl bg-white text-navy-900 hover:bg-neutral-100 border-none font-bold">
                  Submit RFP for {country.name} <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/countries">
                <Button variant="outline" size="lg" className="text-white border-white/40 hover:bg-white/10 font-semibold">
                  View All Operating Nations
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
};

export default CountryDetail;
