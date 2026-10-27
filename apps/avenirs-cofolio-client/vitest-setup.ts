import { setupMswLifecycle } from '@avenirs-esr/test-utils/unit/setup/msw'
import { setupWarningHandler } from '@avenirs-esr/test-utils/unit/setup/warnings'
import { config } from '@vue/test-utils'
import { fetch, FormData, Headers, Request, Response } from 'undici'
import { afterAll, afterEach, beforeAll } from 'vitest'
// eslint-disable-next-line no-restricted-imports
import { i18n, registerFeatureLocales } from './src/plugins/vue-i18n'
import 'blob-polyfill'

// eslint-disable-next-line node/prefer-global/process
const { TextDecoder, TextEncoder } = process.getBuiltinModule('node:util')
// eslint-disable-next-line node/prefer-global/process
const { ReadableStream } = process.getBuiltinModule('node:stream/web')

Object.assign(globalThis, { fetch, FormData, Headers, Request, Response, ReadableStream, TextDecoder, TextEncoder })

window.matchMedia = function () {
  return {
    matches: false,
    media: '',
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false
  }
}

class ResizeObserverStub {
  observe () {}
  unobserve () {}
  disconnect () {}
}

globalThis.ResizeObserver = ResizeObserverStub

setupWarningHandler()

if (__ENABLE_MSW__) {
  setupMswLifecycle({ beforeAll, afterEach, afterAll }, () => import('./src/__mocks__/msw/server'))
}

beforeAll(async () => {
  i18n.global.locale.value = 'fr'
  await registerFeatureLocales('auth')
  await registerFeatureLocales('student')
  await registerFeatureLocales('staff')
  config.global.plugins = config.global.plugins || []
  config.global.plugins.push(i18n)
})
