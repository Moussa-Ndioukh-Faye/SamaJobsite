/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Bleu marine "Sama" du logo officiel
        primary: {
          50:  '#eef0f8',
          100: '#d5d9ee',
          200: '#adb5de',
          300: '#8490cd',
          400: '#5c6cbc',
          500: '#3348ab',
          600: '#1B2A5E',  // bleu marine logo exact (#1B2A5E)
          700: '#162249',
          800: '#101a37',
          900: '#0b1124',
        },
        // Vert "Job" + flèche du logo officiel
        secondary: {
          50:  '#e8faf2',
          100: '#c5f3e0',
          200: '#9aeacc',
          300: '#63dba8',
          400: '#3fcc8a',
          500: '#27AE60',  // vert logo exact (#27AE60)
          600: '#1f914f',
          700: '#17743e',
          800: '#0f572d',
          900: '#083a1d',
        },
        // Couleurs du drapeau sénégalais présentes dans le logo
        senegal: {
          green:  '#009A44',
          yellow: '#FDEF42',
          red:    '#E31E24',
        },
        accent: { 500: '#f59e0b' },
      },
      fontFamily: {
        sans: ['"Inter"', '"Segoe UI"', 'Roboto', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card:         '0 2px 15px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 30px rgba(0,0,0,0.14)',
        'glow':       '0 0 20px rgba(27,42,94,0.15)',
        'glow-green': '0 0 20px rgba(39,174,96,0.2)',
      },
      animation: {
        'float':      'float 4s ease-in-out infinite',
        'fade-up':    'fadeUp 0.5s ease forwards',
        'slide-down': 'slideDown 0.25s ease forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
