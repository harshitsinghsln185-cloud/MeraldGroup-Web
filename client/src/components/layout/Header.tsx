import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, ShieldCheck } from 'lucide-react';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.services'), path: '/services' },
    { label: t('nav.countries'), path: '/countries' },
    { label: t('nav.about'), path: '/about' },
    { label: t('nav.jobs'), path: '/jobs' },
    { label: t('nav.contact'), path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy-900/95 backdrop-blur-md border-b border-teal-500/20 text-white shadow-lg h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex flex-col text-left leading-none">
            <span className="italic font-[300] text-2xl sm:text-3xl text-mint-400 tracking-wide font-heading transition-colors group-hover:text-teal-300">
              Merald
            </span>
            <span className="italic  font-[300] text-[10px] sm:text-xs uppercase tracking-[0.25em] text-white/80 font-heading mt-1 transition-colors group-hover:text-white">
              Group
            </span>
          </div>
          <img
            src="/logo.webp"
            alt="Merald Group"
            className="h-9 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`font-body text-sm font-medium transition-colors hover:text-mint-400 relative py-1 ${
                isActive(item.path)
                  ? 'text-mint-400 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-mint-400'
                  : 'text-gray-200'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Header Right Actions */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher className="bg-white/10 text-white rounded-md px-2 py-1" />
          <Link to="/admin/login">
            <Button variant="gradient" size="sm" className="shadow-md">
              <ShieldCheck className="w-4 h-4 mr-1.5" />
              {t('nav.admin')}
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-3">
          <LanguageSwitcher />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white hover:text-mint-400 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-navy-900 border-b border-teal-500/30 px-4 pt-2 pb-6 space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md font-body text-base font-medium ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-gray-200 hover:bg-white/5 hover:text-mint-400'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2">
            <Link to="/admin/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="gradient" size="md" className="w-full justify-center">
                <ShieldCheck className="w-4 h-4 mr-2" />
                {t('nav.admin')}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
