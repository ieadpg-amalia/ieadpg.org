import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://ieadpg.org',
  output: 'static',
  adapter: cloudflare({
    imageService: 'cloudflare',
    platformProxy: {
      enabled: true
    }
  }),
  vite: {
    ssr: {
      external: ['node:async_hooks']
    }
  }
});
