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
    presetTypography({
      cssExtend: {
        '.prose pre': {
          'background-color': '#ffffff10',
        },
        'code': {
          // orange
          color: 'orange',
        },
        'a:hover': {
          color: '#f43f5e',
        },
        'a:visited': {
          color: '#14b8a6',
        },
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
  ],
})