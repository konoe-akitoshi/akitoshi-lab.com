// astro.config.mjs
import { defineConfig } from 'astro/config';
import UnoCSS from '@unocss/astro';
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://akitoshi-lab.com",
  integrations: [UnoCSS(), sitemap()],
  // パフォーマンス最適化設定（基本的なもののみ残す）
  build: {
    // 画像の最適化
    assets: true,
  },
  // 画像最適化設定
  image: {
    // デフォルトの画質設定
    quality: 80,
  },
});
