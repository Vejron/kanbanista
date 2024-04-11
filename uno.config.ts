// uno.config.ts
import {
  defineConfig,
  presetTypography,
  presetUno
} from 'unocss'

import transformerDirectives from '@unocss/transformer-directives'

export default defineConfig({
  // ...UnoCSS options
  presets: [
    presetUno(), // required
    presetTypography(),
  ],
  transformers: [
    transformerDirectives(),
  ],
})