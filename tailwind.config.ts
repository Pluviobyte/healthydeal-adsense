import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{astro,html,md,mdx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './public/**/*.html'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0f766e',
          light: '#14b8a6',
          dark: '#0f4c48'
        },
        secondary: {
          DEFAULT: '#f97316',
          light: '#fb923c',
          dark: '#c2410c'
        },
        accent: '#84cc16',
        neutral: '#1f2937'
      },
      fontFamily: {
        heading: ['"Work Sans"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif']
      },
      maxWidth: {
        prose: '70ch'
      }
    }
  },
  plugins: []
};

export default config;
