import { config } from '@vue/test-utils'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from './src/__mocks__/msw/server'
import { i18n, registerFeatureLocales } from './src/plugins/vue-i18n'

window.matchMedia = function () {
  return { matches: false }
}

if (__ENABLE_MSW__) {
  beforeAll(() => {
    server.listen({
      onUnhandledRequest: 'error'
    })
  })

  afterEach(() => {
    server.resetHandlers()
  })

  afterAll(() => {
    server.close()
  })
}

beforeAll(async () => {
  i18n.global.locale.value = 'fr'
  await registerFeatureLocales('student')
  config.global.plugins = config.global.plugins || []
  config.global.plugins.push(i18n)
})
