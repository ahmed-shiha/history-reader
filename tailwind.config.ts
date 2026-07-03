import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'ink':            '#1A1008',
        'ink-mid':        '#4A3420',
        'ink-lt':         '#7A6A58',
        'paper':          '#F8F4EE',
        'surface':        '#EDE9DE',
        'rule':           '#D8CEBC',
        'greek':          '#7A4B1C',
        'greek-light':    '#FBF3E5',
        'modern':         '#26527A',
        'modern-light':   '#EEF3FA',
        'highlight':      '#FEF08A',
        'highlight-active': '#FDE047',
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
