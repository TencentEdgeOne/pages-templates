import type { Theme } from 'unocss/preset-uno'
import {
  defineConfig,
  presetAttributify,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import presetTheme from 'unocss-preset-theme'
import { themeConfig } from './src/config.ts'

const { light, dark } = themeConfig.color

export default defineConfig({
  presets: [
    presetWind3(),
    presetAttributify(),
    presetTheme<Theme>({
      theme: {
        dark: {
          colors: dark,
        },
      },
    }),
  ],
  theme: {
    colors: light,
    fontFamily: {
      title: ['Snell-Black', 'EarlySummer-Subset', 'EarlySummer', 'ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
      navbar: ['STIX-Italic', 'EarlySummer-Subset', 'EarlySummer', 'ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
      time: ['Snell-Bold', 'ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
      serif: ['STIX', 'EarlySummer', 'Georgia', 'ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
    },
  },
  shortcuts: {
    'uno-desktop-column': 'fixed w-14rem right-[max(5.625rem,calc(50vw-34.375rem))]',
    'uno-tags-style': 'inline-block whitespace-nowrap border border-secondary/25 rounded-full px-3.2 py-0.7 c-secondary transition-colors hover:(border-secondary/75 text-primary)',
    'uno-decorative-line': 'h-0.25 w-10 bg-secondary/25 mb-4.5 lg:(w-11 mb-6)',
    'uno-tags-wrapper': 'w-95% flex flex-wrap gap-x-3 gap-y-3.2 lg:w-100%',
  },
  rules: [
    ['scrollbar-hidden', {
      'scrollbar-width': 'none',
      '-ms-overflow-style': 'none',
    }],
    ['ios-flash-fix', {
      'backface-visibility': 'hidden',
      '-webkit-backface-visibility': 'hidden',
    }],
    ['force-gpu', {
      'transform': 'translateZ(0)',
      '-webkit-transform': 'translateZ(0)',
    }],
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
