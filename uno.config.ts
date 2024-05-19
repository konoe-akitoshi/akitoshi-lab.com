// uno.config.ts
import { defineConfig, presetWind } from 'unocss'
import { presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetWind(),
    presetIcons({
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
        // ...
      },
    }),
  ],
  shortcuts: {
    // 例: 'btn': 'px-4 py-2 rounded bg-blue-500 text-white',
  },
  rules: [
    // カスタムルールを追加できます
  ],
})

