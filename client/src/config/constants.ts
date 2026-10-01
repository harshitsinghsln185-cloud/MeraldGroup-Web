// Merald Group System Constants & Configurations

export type UserRole = 'HR' | 'ACCOUNTS' | 'ADMIN' | 'SITE_SUPERVISOR';

export type SupportedCountrySlug = 'nigeria' | 'india' | 'uae' | 'ghana' | 'uganda';

export interface CountryInfo {
  name: string;
  slug: SupportedCountrySlug;
  flag: string;
  currency: 'INR' | 'NGN' | 'AED' | 'GHS' | 'UGX';
  capital: string;
  code: string;
}

export const USER_ROLES: Record<string, UserRole> = {
  HR: 'HR',
  ACCOUNTS: 'ACCOUNTS',
  ADMIN: 'ADMIN',
  SITE_SUPERVISOR: 'SITE_SUPERVISOR',
};

export const SUPPORTED_CURRENCIES = {
  INR: { symbol: '₹', name: 'Indian Rupee' },
  NGN: { symbol: '₦', name: 'Nigerian Naira' },
} as const;

export type PayrollCurrency = keyof typeof SUPPORTED_CURRENCIES;

export const COUNTRIES: CountryInfo[] = [
  { name: 'Nigeria', slug: 'nigeria', flag: '🇳🇬', currency: 'NGN', capital: 'Abuja', code: '+234' },
  { name: 'India', slug: 'india', flag: '🇮🇳', currency: 'INR', capital: 'New Delhi', code: '+91' },
  { name: 'United Arab Emirates', slug: 'uae', flag: '🇦🇪', currency: 'AED', capital: 'Abu Dhabi', code: '+971' },
  { name: 'Ghana', slug: 'ghana', flag: '🇬🇭', currency: 'GHS', capital: 'Accra', code: '+233' },
  { name: 'Uganda', slug: 'uganda', flag: '🇺🇬', currency: 'UGX', capital: 'Kampala', code: '+256' },
];

export const DOCUMENT_TYPES = [
  'Passport',
  'Visa / Work Permit',
  'National ID / Tax PIN',
  'Educational Certificate',
  'HSE Certification',
  'Employment Contract',
] as const;

export const DOCUMENT_EXPIRY_WARNING_DAYS = {
  SAFE: 60,
  ATTENTION: 30,
  URGENT: 15,
} as const;

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://meraldgroup-web.onrender.com/api/v1';

export const HERO_VIDEO_URL = '/Merald.mp4';

/**
 * Centralized API fetch helper that prepends API_BASE_URL,
 * attaches JWT Bearer token automatically, and handles Render cold starts with graceful retry.
 */
export async function apiFetch(endpoint: string, options: RequestInit = {}, retries = 1): Promise<Response> {
  let url = endpoint;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    const base = API_BASE_URL.replace(/\/$/, '');
    if (url.startsWith('/api/v1')) {
      url = `${base}${url.replace(/^\/api\/v1/, '')}`;
    } else {
      url = `${base}${url.startsWith('/') ? url : `/${url}`}`;
    }
  }

  const headers = new Headers(options.headers || {});
  const token = localStorage.getItem('merald_token');
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    if ((response.status === 502 || response.status === 503) && retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 2500));
      return apiFetch(endpoint, options, retries - 1);
    }
    return response;
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 2500));
      return apiFetch(endpoint, options, retries - 1);
    }
    throw error;
  }
}


