import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAFAF8',
        surface: '#FFFFFF',
        border: '#E8E8E4',
        'text-primary': '#0A0A0A',
        'text-muted': '#6B7280',
        accent: '#1A1A2E',
        cta: '#6366F1',
        'cta-hover': '#4F46E5',
        success: '#10B981',
        'tag-bg': '#F0F0F9',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
      },
      fontSize: {
        'display-xl': ['72px', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'display-lg': ['56px', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
        'display-md': ['40px', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'heading-lg': ['28px', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        'heading-md': ['20px', { lineHeight: '1.35' }],
        'body-lg': ['16px', { lineHeight: '1.6' }],
        'body-sm': ['14px', { lineHeight: '1.5' }],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px 0 rgba(0,0,0,0.08), 0 2px 4px -1px rgba(0,0,0,0.04)',
        'cta-glow': '0 0 20px rgba(99,102,241,0.3)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'number-flip': 'numberFlip 0.3s ease-in-out',
        'pulse-ring': 'pulseRing 0.5s ease-out',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        numberFlip: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseRing: {
          '0%': { boxShadow: '0 0 0 0 rgba(99,102,241,0.4)' },
          '100%': { boxShadow: '0 0 0 12px rgba(99,102,241,0)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}

export default config
