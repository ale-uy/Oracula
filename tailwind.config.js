/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        fadeIn: 'fadeIn 1s ease-in',
        scaleIn: 'scaleIn 0.8s ease-out',
        fadeInDelay: 'fadeIn 1s ease-in 1s forwards',
        candleFlicker: 'candleFlicker 3s ease-in-out infinite',
        flicker: 'flicker 2s ease-in-out infinite',
        fadeInDelay2: 'fadeIn 1s ease-in 1.5s forwards',
        float: 'float 6s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite',
        twinkle: 'twinkle 1.5s ease-in-out infinite',
        'twinkle-delay': 'twinkle 1.5s ease-in-out 0.5s infinite',
        'twinkle-delay-2': 'twinkle 1.5s ease-in-out 1s infinite',
        wave: 'wave 3s ease-in-out infinite',
        'wave-delay': 'wave 3s ease-in-out 1.5s infinite',
        pulse: 'pulse 2s ease-in-out infinite',
        'golden-reveal': 'goldenReveal 1s ease-out forwards',
        'card-float': 'cardFloat 4s ease-in-out infinite',
        'golden-aura': 'goldenAura 3s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { filter: 'brightness(1)' },
          '50%': { filter: 'brightness(1.3)' },
        },
        twinkle: {
          '0%, 100%': { opacity: 0.2 },
          '50%': { opacity: 0.8 },
        },
        wave: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        pulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        goldenReveal: {
          '0%': { 
            boxShadow: '0 0 0 0 rgba(234, 179, 8, 0)',
            transform: 'scale(1)'
          },
          '50%': {
            boxShadow: '0 0 30px 10px rgba(234, 179, 8, 0.8)',
            transform: 'scale(1.05)'
          },
          '100%': {
            boxShadow: '0 0 15px 5px rgba(234, 179, 8, 0.4)',
            transform: 'scale(1)'
          }
        },
        cardFloat: {
          '0%, 100%': {
            transform: 'rotateY(180deg) translateY(0px)',
          },
          '50%': {
            transform: 'rotateY(180deg) translateY(-5px)',
          }
        },
        goldenAura: {
          '0%, 100%': {
            boxShadow: '0 0 15px 5px rgba(234, 179, 8, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 20px 8px rgba(234, 179, 8, 0.5)',
          }
        },
        shimmer: {
          '0%': {
            opacity: '0',
            transform: 'translateX(-100%)',
          },
          '50%': {
            opacity: '0.5',
          },
          '100%': {
            opacity: '0',
            transform: 'translateX(100%)',
          }
        },
      },
      perspective: {
        '1000': '1000px',
      },
      transformStyle: {
        'preserve-3d': 'preserve-3d',
      },
      backfaceVisibility: {
        'hidden': 'hidden',
      },
      rotate: {
        'y-180': 'rotateY(180deg)',
      },
    },
  },
  plugins: [],
}
