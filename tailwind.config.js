/** @type {import('tailwindcss').Config} */

// Every colour is a CSS variable (see src/theme/themes.js), so changing the theme
// changes the whole website. `<alpha-value>` keeps opacity classes like bg-white/70 working.
const c = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;
const ramp = (family, shades) => Object.fromEntries(shades.map((s) => [s, c(`${family}-${s}`)]));

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        white: c('white'),
        cream: ramp('cream', [50, 100, 200]),
        blush: ramp('blush', [100, 200, 300, 400, 500]),
        lilac: ramp('lilac', [100, 200, 300, 400, 500]),
        ink: ramp('ink', [500, 600, 700, 800]),
        // category / mood tints
        sky: ramp('sky', [50, 100, 300, 700]),
        amber: ramp('amber', [50, 100, 300, 700]),
        emerald: ramp('emerald', [100, 300]),
        orange: ramp('orange', [50, 100, 300, 700]),
        indigo: ramp('indigo', [50, 100, 300, 600]),
        // overlay behind dialogs, and text on filled accent circles (always white)
        scrim: c('scrim'),
        'on-accent': '#FFFFFF',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgb(var(--c-shadow) / var(--shadow-a))',
        petal: '0 8px 24px -8px rgb(var(--c-petal) / 0.5)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        rise: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        rise: 'rise 0.7s ease-out both',
      },
    },
  },
  plugins: [],
};
