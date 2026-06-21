import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://Fang0415.github.io',
  integrations: [mdx()],
  markdown: {
    // Flat charcoal code surface, matching the design system's article page.
    syntaxHighlight: false,
  },
});
