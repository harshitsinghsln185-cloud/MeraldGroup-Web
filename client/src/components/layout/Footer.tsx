import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Globe, ArrowRight } from 'lucide-react';
import { Text } from '../ui/Typography';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-navy-900 text-white pt-16 pb-12 border-t border-teal-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand & Corporate Mission */}
          <div>
            <Link to="/" className="inline-flex items-center gap-3 mb-4 group">
              <div className="flex flex-col text-left leading-none">
                <span className="italic  font-[300] text-2xl sm:text-3xl text-mint-400 tracking-wide font-heading transition-colors group-hover:text-teal-300">
                  Merald
                </span>
                <span className="italic  font-[300] text-[10px] sm:text-xs uppercase tracking-[0.25em] text-white/80 font-heading mt-1 transition-colors group-hover:text-white">
                  Group
                </span>
              </div>
              <img
                src="/logo.webp"
                alt="Merald Group"
                className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <Text size="small" color="white" className="mb-6 text-gray-300 opacity-90">
              Pioneering infrastructure construction, MEP engineering, integrated facility operations, logistics, and technical workforce deployment across continents.
            </Text>
            <div className="flex items-center gap-3 text-xs text-mint-400 font-body font-medium">
              <Globe className="w-4 h-4 text-teal-500" />
              <span>Nigeria | India | UAE | Ghana | Uganda</span>
            </div>
          </div>

          {/* Business Verticals */}
          <div>
            <h4 className="font-heading font-bold text-base text-white mb-4 uppercase tracking-wider">
              Business Verticals
            </h4>
            <ul className="space-y-2.5 font-body text-sm text-gray-300">
              <li><Link to="/services" className="hover:text-mint-400 transition-colors">EPC & MEP Contracting</Link></li>
              <li><Link to="/services" className="hover:text-mint-400 transition-colors">Integrated Facility Management (IFM)</Link></li>
              <li><Link to="/services" className="hover:text-mint-400 transition-colors">Product & Board Distribution</Link></li>
              <li><Link to="/services" className="hover:text-mint-400 transition-colors">Haulify Heavy Logistics</Link></li>
              <li><Link to="/services" className="hover:text-mint-400 transition-colors">Global Technical Manpower</Link></li>
            </ul>
          </div>

          {/* Quick Nav Links */}
          <div>
            <h4 className="font-heading font-bold text-base text-white mb-4 uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 font-body text-sm text-gray-300">
              <li><Link to="/" className="hover:text-mint-400 transition-colors">{t('nav.home')}</Link></li>
              <li><Link to="/countries" className="hover:text-mint-400 transition-colors">{t('nav.countries')}</Link></li>
              <li><Link to="/about" className="hover:text-mint-400 transition-colors">{t('nav.about')}</Link></li>
              <li><Link to="/jobs" className="hover:text-mint-400 transition-colors">{t('nav.jobs')}</Link></li>
              <li><Link to="/contact" className="hover:text-mint-400 transition-colors">{t('nav.contact')}</Link></li>
              <li><Link to="/admin/login" className="hover:text-mint-400 transition-colors">{t('nav.admin')}</Link></li>
            </ul>
          </div>

          {/* Head Office Info */}
          <div>
            <h4 className="font-heading font-bold text-base text-white mb-4 uppercase tracking-wider">
              Global Contact
            </h4>
            <div className="space-y-3 font-body text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                <span>Sector 44, Cyber City District, Gurgaon, Haryana 122002, India</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-teal-500 shrink-0" />
                <span>+91 124 456 7890</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-teal-500 shrink-0" />
                <span>contact@meraldgroup.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 font-body">
          <p>© {new Date().getFullYear()} Merald Group. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/contact" className="hover:text-white transition-colors flex items-center gap-1">
              Request Proposal <ArrowRight className="w-3 h-3 text-teal-500" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
