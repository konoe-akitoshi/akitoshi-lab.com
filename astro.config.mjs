// astro.config.mjs
import { defineConfig } from 'astro/config';
import UnoCSS from '@unocss/astro';
import react from '@astrojs/react';
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://akitoshi-lab.com",
  integrations: [UnoCSS(), react(), sitemap()]
});