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
          light: '#EDE9FE',
          DEFAULT: '#7C3AED',
          dark: '#6D28D9',
        },
        // Semantic
        positive: '#10B981',
        alert: '#F43F5E',
        // Text
        navy: '#1A1A2E',
        // Existing (for backward compatibility if needed, but we'll phase out)
        dark: '#0f172a',
        darker: '#020617',
      },
      backgroundColor: {
        'page-light': '#F8F7FF',
        'page-dark': '#0F0F1A',
        'card-dark': '#1A1A2E',
        'sidebar-dark': '#13131F',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 12px rgba(0,0,0,0.07)',
      }
    },
  },
  plugins: [],
}
