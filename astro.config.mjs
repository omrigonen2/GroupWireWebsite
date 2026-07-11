import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://groupwire.cloud',
  output: 'static',
  integrations: [sitemap()],
  build: {
    format: 'directory',
  },
});
