/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0D2E45',
          800: '#0F3854',
          700: '#14476B',
        },
        blue: {
          600: '#1D6FA5',
        },
        teal: {
          500: '#3D9DA0',
          400: '#55B4B7',
        },
        mint: {
          400: '#83C9B8',
          100: '#E4F5EE',
        },
        neutral: {
          900: '#1A1F24',
          700: '#374151',
          500: '#6B7280',
          100: '#F7F9FA',
        },
        brand: {
          error: '#D64545',
          success: '#2E9E5B',
        },
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        logo: ['Sacramento', 'cursive'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #0D2E45 0%, #1D6FA5 45%, #3D9DA0 75%, #83C9B8 100%)',
      },
    },
  },
  plugins: [],
};
