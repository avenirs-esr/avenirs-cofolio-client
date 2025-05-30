import { config } from '@vue/test-utils'
import { beforeAll } from 'vitest'
import { i18n, registerFeatureLocales } from './src/plugins/vue-i18n'

window.matchMedia = function () {
  return { matches: false }
}

beforeAll(async () => {
  i18n.global.locale.value = 'fr'
  await registerFeatureLocales('student')
  config.global.plugins = config.global.plugins || []
  config.global.plugins.push(i18n)
})
