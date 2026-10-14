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

const IGNORED_WARNINGS = []
const FAILED_WARNINGS: string[] = ['[Vue warn]', '[intlify]']
const originalWarn = console.warn

const isIgnoredWarning = (message: string) => IGNORED_WARNINGS.some(text => message.includes(text))

function setupWarningHandler () {
  console.warn = (...args: any[]) => {
    const message = args.map(String).join(' ')

    if (FAILED_WARNINGS.some(warningPrefix => message.includes(warningPrefix))) {
      if (isIgnoredWarning(message)) {
        originalWarn(...args)
        return
      }

      throw new Error(`❌ Vue warning detected during test:\n${message}`)
    }

    originalWarn(...args)
  }
}

setupWarningHandler()

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
  await registerFeatureLocales('auth')
  await registerFeatureLocales('student')
  await registerFeatureLocales('staff')
  config.global.plugins = config.global.plugins || []
  config.global.plugins.push(i18n)
})
