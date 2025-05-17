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
  theme: {
    fontFamily: {
      sans: [
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        '"Noto Sans JP"',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"',
      ],
      mono: [
        'ui-monospace',
        'SFMono-Regular',
        'Menlo',
        'Monaco',
        'Consolas',
        '"Liberation Mono"',
        '"Courier New"',
        'monospace',
      ],
    },
    colors: {
      background: 'theme(colors.gray.50)',
      text: 'theme(colors.gray.900)',
      primary: 'theme(colors.blue.500)',
      secondary: 'theme(colors.gray.500)',
      accent: 'theme(colors.orange.500)',
    },
  },
  shortcuts: {
    'btn': 'inline-flex items-center justify-start gap-2 p-3 rounded-lg cursor-pointer transition-colors duration-300',
    'btn-primary': 'btn bg-primary text-white hover:bg-blue-600 active:bg-blue-700',
    'btn-secondary': 'btn bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800',
    // 例: 'btn': 'px-4 py-2 rounded bg-blue-500 text-white',
  },
  rules: [
    [/^h1$/, () => ({ 'font-size': '2em', 'margin-bottom': '0.5em' })],
    [/^h2$/, () => ({ 'font-size': '1.5em', 'margin-bottom': '0.5em' })],
    [/^p$/, () => ({ 'margin-bottom': '1em', 'line-height': '1.5' })],
    // カスタムルールを追加できます
  ],
})

