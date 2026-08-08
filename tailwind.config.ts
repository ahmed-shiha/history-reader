import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // All tokens reference CSS vars (RGB triplets) so opacity modifiers work:
        // bg-ink/50  →  rgb(var(--ink) / 0.5)  ✓
        'ink':              'rgb(var(--ink) / <alpha-value>)',
        'ink-mid':          'rgb(var(--ink-mid) / <alpha-value>)',
        'ink-lt':           'rgb(var(--ink-lt) / <alpha-value>)',
        'paper':            'rgb(var(--paper) / <alpha-value>)',
        'surface':          'rgb(var(--surface) / <alpha-value>)',
        'rule':             'rgb(var(--rule) / <alpha-value>)',
        'greek':            'rgb(var(--greek) / <alpha-value>)',
        'greek-light':      'rgb(var(--greek-light) / <alpha-value>)',
        'modern':           'rgb(var(--modern) / <alpha-value>)',
        'modern-light':     'rgb(var(--modern-light) / <alpha-value>)',
        'highlight':        'rgb(var(--highlight) / <alpha-value>)',
        'highlight-active': 'rgb(var(--highlight-active) / <alpha-value>)',
      },
      fontFamily: {
        tajawal: ['var(--font-tajawal)', 'Tajawal', 'Traditional Arabic', 'sans-serif'],
        arabic:  ['Traditional Arabic', 'Arabic Typesetting', 'Times New Roman', 'serif'],
        math:    ['Georgia', 'Times New Roman', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
