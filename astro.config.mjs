// astro.config.mjs
import { defineConfig } from 'astro/config';
import UnoCSS from '@unocss/astro';
import sitemap from "@astrojs/sitemap";

import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  site: "https://akitoshi-lab.com",
  integrations: [UnoCSS(), sitemap(), svelte()],
  // パフォーマンス最適化設定（基本的なもののみ残す）
  build: {
    // アセットファイルの出力先ディレクトリ
    assets: '_astro',
  },
  // 画像最適化設定
  image: {
    // デフォルトの画質設定
    quality: 80,
  },
});