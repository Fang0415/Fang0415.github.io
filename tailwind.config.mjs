/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        ink: '#050505',
        muted: '#6f6f6f',
        hairline: '#e4e4e4',
        paper: '#ffffff',
        soft: '#f6f6f3',
        linear: '#5e6ad2',
        panel: '#101112',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Noto Serif CJK SC"', '"Songti SC"', 'STSong', 'Georgia', 'serif'],
        mono: ['SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        hairline: '0 1px 0 rgba(0,0,0,0.05)',
        lift: '0 16px 40px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};
