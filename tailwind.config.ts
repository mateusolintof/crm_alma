import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand (Royal Blue)
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          active: '#1E40AF',
          subtle: '#EFF6FF',
          border: '#BFDBFE',
        },
        // Neutrals (Slate)
        bg: {
          app: '#F8FAFC',
          surface: '#FFFFFF',
          hover: '#F1F5F9',
          border: '#E2E8F0',
          'border-hover': '#CBD5E1',
        },
        text: {
          primary: '#0F172A',
          secondary: '#475569',
          tertiary: '#94A3B8',
          'on-primary': '#FFFFFF',
        },
        // Semantic Colors
        success: {
          DEFAULT: '#10B981',
          hover: '#0EA371',
          active: '#0C8C63',
          bg: '#ECFDF5',
        },
        warning: {
          DEFAULT: '#F59E0B',
          bg: '#FFFBEB',
        },
        danger: {
          DEFAULT: '#EF4444',
          hover: '#DC2626',
          active: '#B91C1C',
          bg: '#FEF2F2',
        },
        info: {
          DEFAULT: '#3B82F6',
          bg: '#EFF6FF',
        },
        channels: {
          whatsapp: { text: '#128C7E', bg: '#E9F8F1', border: '#C7EDE0' },
          email: { text: '#1D4ED8', bg: '#EFF6FF', border: '#BFDBFE' },
          instagram: { text: '#C13584', bg: '#FDF1F7', border: '#FAC7E6' },
          sms: { text: '#7C3AED', bg: '#F4F0FF', border: '#E0D9FF' },
          web: { text: '#0F172A', bg: '#F8FAFC', border: '#E2E8F0' },
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'IBM Plex Mono', 'monospace'],
      },
      fontSize: {
        '2xs': '0.625rem',
      },
      borderRadius: {
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'focus': '0 0 0 2px #fff, 0 0 0 4px #BFDBFE',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        shimmer: 'shimmer 2s linear infinite',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      spacing: {
        120: '120px',
        260: '260px',
        320: '320px',
        400: '400px',
      },
    },
  },
  plugins: [],
};
export default config;
