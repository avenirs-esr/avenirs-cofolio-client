import { setupMswLifecycle } from '@avenirs-esr/test-utils/unit/setup/msw'
import { setupWarningHandler } from '@avenirs-esr/test-utils/unit/setup/warnings'
import { config } from '@vue/test-utils'
import { afterAll, afterEach, beforeAll } from 'vitest'
// eslint-disable-next-line no-restricted-imports
import { i18n, registerFeatureLocales } from './src/plugins/vue-i18n'
import 'blob-polyfill'

window.matchMedia = function () {
  return { matches: false }
}

setupWarningHandler()

if (__ENABLE_MSW__) {
  setupMswLifecycle({ beforeAll, afterEach, afterAll }, () => import('./src/__mocks__/msw/server'))
}

beforeAll(async () => {
  i18n.global.locale.value = 'fr'
  await registerFeatureLocales('terms-of-service')
  config.global.plugins = config.global.plugins || []
  config.global.plugins.push(i18n)
})
