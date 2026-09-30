// Merald Group Design System Tokens (Single Source of Truth)

export interface ThemeColors {
  navy900: string;
  navy700: string;
  blue600: string;
  teal500: string;
  mint400: string;
  mint100: string;
  neutral900: string;
  neutral500: string;
  neutral100: string;
  white: string;
  error: string;
  success: string;
}

export interface ThemeGradient {
  brand: string;
}

export interface ThemeFonts {
  heading: string;
  body: string;
  logo: string;
}

export const themeTokens: {
  colors: ThemeColors;
  gradient: ThemeGradient;
  fonts: ThemeFonts;
} = {
  colors: {
    navy900: '#0D2E45',
    navy700: '#14476B',
    blue600: '#1D6FA5',
    teal500: '#3D9DA0',
    mint400: '#83C9B8',
    mint100: '#E4F5EE',
    neutral900: '#1A1F24',
    neutral500: '#6B7280',
    neutral100: '#F7F9FA',
    white: '#FFFFFF',
    error: '#D64545',
    success: '#2E9E5B',
  },
  gradient: {
    brand: 'linear-gradient(135deg, #0D2E45 0%, #1D6FA5 45%, #3D9DA0 75%, #83C9B8 100%)',
  },
  fonts: {
    heading: "'Poppins', sans-serif",
    body: "'Inter', sans-serif",
    logo: "'Sacramento', 'Pacifico', cursive",
  },
};
