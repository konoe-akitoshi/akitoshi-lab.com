// astro.config.mjs
import { defineConfig, passthroughImageService, sharpImageService } from 'astro/config';
import UnoCSS from '@unocss/astro';
import sitemap from "@astrojs/sitemap";
import svelte from '@astrojs/svelte';
import { EventEmitter } from 'node:events';

EventEmitter.defaultMaxListeners = 20;

const isDocker = process.env.DOCKER === '1';

// https://astro.build/config
export default defineConfig({
  site: "https://akitoshi-lab.com",
  integrations: [UnoCSS(), sitemap(), svelte()],
  build: {
    assets: '_astro',
  },
  image: {
    service: isDocker ? passthroughImageService() : sharpImageService(),
    quality: 80,
    responsiveStyles: true,
    layout: 'constrained',
    breakpoints: [640, 750, 828, 1080, 1280],
  },
});