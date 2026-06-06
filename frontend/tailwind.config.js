/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand / Accent
        brand: {
          light: '#F3F0FF',
          DEFAULT: '#7C3AED',
          dark: '#6D28D9',
          accent: '#A78BFA', // Lighter violet for dark mode
        },
        // Semantic
        positive: '#10B981',
        alert: '#F43F5E',
        // Text
        navy: '#111827',
      },
      backgroundColor: {
        'page-light': '#FFFFFF',
        'page-dark': '#000000',
        'sidebar-light': '#FFFFFF',
        'sidebar-dark': '#0A0A0A',
        'card-dark': '#111111',
        'header-dark': '#000000',
        'search-light': '#F9FAFB',
        'search-dark': '#111111',
        'toggle-light': '#F3F4F6',
        'icon-dark': '#1E1E2E',
      },
      borderColor: {
        'light': '#F0F0F0',
        'dark': '#1F1F1F',
        'card-light': '#EFEFEF',
        'card-dark': '#222222',
        'header-light': '#F0F0F0',
        'header-dark': '#1A1A1A',
        'search-light': '#E5E7EB',
        'search-dark': '#2D2D2D',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 12px rgba(0,0,0,0.04)',
      }
    },
  },
  plugins: [],
}
