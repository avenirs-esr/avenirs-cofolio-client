import { config } from '@vue/test-utils'
import { beforeAll, beforeEach } from 'vitest'
import { createI18n } from 'vue-i18n'
import { AvSharedMessages } from './src/i18n'

const i18n = createI18n({
  legacy: false,
  locale: 'fr',
  fallbackLocale: 'en',
  messages: structuredClone(AvSharedMessages),
})

beforeAll(() => {
  config.global.plugins = config.global.plugins || []
  config.global.plugins.push(i18n)
})

beforeEach(() => {
  i18n.global.locale.value = 'fr'
})
