import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
    { code: 'ar', label: 'العربية', flag: '🇦🇪' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
  ];

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className={`relative inline-flex items-center gap-2 ${className}`}>
      <Globe className="w-4 h-4 text-teal-500" />
      <select
        value={i18n.language}
        onChange={handleLanguageChange}
        className="bg-transparent text-sm font-medium text-inherit border border-teal-500/30 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-white text-neutral-900">
            {lang.flag} {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};
