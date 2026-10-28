import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { http, HttpResponse } from 'msw'
import { beforeEach, expect } from 'vitest'
import { server } from '@/__mocks__/msw/server'

const initialHandlers = server.listHandlers()
const url = 'http://127.0.0.1:18181/__shared_setup_contract__'
const handler = http.get(url, () => HttpResponse.json({ source: 'local-test-server' }))

BddTest().given('the application-owned test setup', () => {
  BddTest().when('a media query is evaluated', () => {
    let mediaQuery: MediaQueryList

    beforeEach(() => {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    })

    BddTest().then('it returns a complete non-matching media query list', () => {
      expect(mediaQuery).toMatchObject({
        matches: false,
        media: '',
        onchange: null,
        addEventListener: expect.any(Function),
        removeEventListener: expect.any(Function),
        addListener: expect.any(Function),
        removeListener: expect.any(Function),
        dispatchEvent: expect.any(Function),
      })
    })
  })

  for (const prefix of ['[Vue warn]', '[intlify]']) {
    BddTest().when(`a ${prefix} warning is emitted`, () => {
      BddTest().then('it retains the strict warning failure', () => {
        expect(() => console.warn(prefix, 'setup contract')).toThrow(`❌ Vue warning detected during test:\n${prefix} setup contract`)
      })
    })
  }

  BddTest().when('a local MSW handler is registered before each test', () => {
    beforeEach(() => {
      server.use(handler)
    })

    BddTest().then('it intercepts a request through the server installed by the local runner', async () => {
      const response = await fetch(url)
      expect(await response.json()).toEqual({ source: 'local-test-server' })
      expect(server.listHandlers()).toEqual([handler, ...initialHandlers])
    })

    BddTest().then('it starts the next test without leaked handler overrides', () => {
      expect(server.listHandlers()).toEqual([handler, ...initialHandlers])
    })
  })
})
