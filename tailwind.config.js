/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0F1E",
        primary: "#F59E0B",
        accent: "#60A5FA",
        muted: "#94A3B8",
        surface: "rgba(255,255,255,0.04)",
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        body: ['17px', { lineHeight: '1.6' }],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'draw-line': 'drawLine 2s ease-out forwards',
        'spin-slow': 'spin 30s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-16px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(245,158,11,0.3), 0 0 60px rgba(245,158,11,0.1)' },
          '50%': { boxShadow: '0 0 30px rgba(245,158,11,0.5), 0 0 80px rgba(245,158,11,0.2)' },
        },
        drawLine: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
      backdropBlur: {
        '2xl': '40px',
      },
    },
  },
  plugins: [],
}
