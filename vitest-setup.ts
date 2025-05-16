// setupTests.ts
import { config } from '@vue/test-utils'
import { i18n } from './src/i18n'

i18n.global.locale.value = 'fr'

config.global.plugins = config.global.plugins || []
config.global.plugins.push(i18n)

window.matchMedia = function () {
  return { matches: false }
}
