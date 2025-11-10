import { config } from '@vue/test-utils'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { i18n, registerFeatureLocales } from './src/plugins/vue-i18n'
import 'blob-polyfill'

window.matchMedia = function () {
  return { matches: false }
}

if (__ENABLE_MSW__) {
  beforeAll(async () => {
    const { server } = await import('./src/__mocks__/msw/server')
    server.listen({
      onUnhandledRequest: 'error'
    })
  })

  afterEach(async () => {
    const { server } = await import('./src/__mocks__/msw/server')
    server.resetHandlers()
  })

  afterAll(async () => {
    const { server } = await import('./src/__mocks__/msw/server')
    server.close()
  })
}

beforeAll(async () => {
  i18n.global.locale.value = 'fr'
  await registerFeatureLocales('student')
  config.global.plugins = config.global.plugins || []
  config.global.plugins.push(i18n)
})
