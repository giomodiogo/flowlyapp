/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#1a1f36',
        muted: '#9aa3b2',
        canvas: '#f4f6fb',
        accent: {
          DEFAULT: '#2f6bff',
          pink: '#ec3f8b',
          purple: '#7c5cff',
        },
      },
      boxShadow: {
        card: '0 12px 30px -12px rgba(26, 31, 54, 0.12)',
        fab: '0 12px 24px -6px rgba(47, 107, 255, 0.5)',
        nav: '0 -8px 30px -16px rgba(26, 31, 54, 0.18)',
      },
      borderRadius: {
        xl2: '1.75rem',
      },
    },
  },
  plugins: [],
}
