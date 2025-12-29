/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#22C55E',
          hover: '#16A34A',
          light: '#86EFAC',
        },
        dark: {
          bg: '#000000',        // Pure black background
          section: '#0a0a0a',   // Very dark gray for sections
          card: '#0a0a0a',      // Very dark gray for cards (slight depth)
          hover: '#1a1a1a',     // Subtle hover state
          border: '#2a2a2a',    // Visible borders in black mode
          text: '#ffffff',      // Pure white text
          'text-secondary': '#a3a3a3', // Gray text for secondary content
        },
        light: {
          bg: '#F8FAFC',
          section: '#F1F5F9',
          card: '#FFFFFF',
          hover: '#EEF2F7',
          border: '#E2E8F0',
          text: '#0F172A',
          'text-secondary': '#334155',
        },
      },
      borderRadius: {
        'card': '14px',
      },
      boxShadow: {
        'card-dark': '0 2px 8px rgba(0, 0, 0, 0.3)',
        'card-light': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'card-hover-dark': '0 4px 16px rgba(0, 0, 0, 0.4)',
        'card-hover-light': '0 4px 16px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
