import type { AvLocale } from '@avenirs-esr/shared'
import type { CguDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { MockInstance } from 'vitest'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { http, HttpResponse } from 'msw'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { server } from '@/__mocks__/msw/server'

BddTest().given('the Backoffice shared HTTP configuration', () => {
  const cgu: CguDTO = {
    id: 'cgu-id',
    version: 1,
    uploadedAt: '2026-11-12T12:00:00Z',
    content: 'Terms of service',
  }
  const onRequest = vi.fn<(request: Request) => void>()
  let shared: typeof import('@avenirs-esr/shared')
  let api: typeof import('@avenirs-esr/shared/api/avenir-esr')
  let i18n: typeof import('@/plugins/vue-i18n').i18n
  let configureSharedFetchSpy: MockInstance<typeof shared.configureSharedFetch>
  let createCustomFetchSpy: MockInstance<typeof shared.createCustomFetch>

  beforeEach(async () => {
    vi.resetModules()
    onRequest.mockClear()
    shared = await import('@avenirs-esr/shared')
    i18n = (await import('@/plugins/vue-i18n')).i18n
    i18n.global.locale.value = 'fr'
    configureSharedFetchSpy = vi.spyOn(shared, 'configureSharedFetch')
    createCustomFetchSpy = vi.spyOn(shared, 'createCustomFetch')

    await import('@/api/avenir-esr/fetch-instance/fetch-instance')
    api = await import('@avenirs-esr/shared/api/avenir-esr')

    server.use(http.get(`*${api.getGetLatestCguUrl()}`, ({ request }) => {
      onRequest(request)
      return HttpResponse.json(cgu)
    }))
  })

  afterEach(() => {
    i18n.global.locale.value = 'fr'
    vi.restoreAllMocks()
  })

  BddTest().when('the configuration module is initialized', () => {
    BddTest().then('it configures the shared transport exactly once', () => {
      expect(configureSharedFetchSpy).toHaveBeenCalledExactlyOnceWith({
        baseUrl: __BASE_URL__,
        defaultHeaders: { 'Content-Type': 'application/json' },
      }, expect.any(shared.FetchInterceptorManager))
    })

    BddTest().then('it does not create an unused local fetcher', () => {
      expect(createCustomFetchSpy).not.toHaveBeenCalled()
    })

    BddTest().then('it does not send a request during initialization', () => {
      expect(onRequest).not.toHaveBeenCalled()
    })
  })

  BddTest().when('a shared request is made', () => {
    let result: CguDTO

    beforeEach(async () => {
      result = await api.getLatestCgu()
    })

    BddTest().then('it uses the Backoffice API base URL', () => {
      expect(onRequest).toHaveBeenCalledTimes(1)
      expect(onRequest.mock.calls[0][0].url).toBe(`${__BASE_URL__.replace(/\/$/, '')}${api.getGetLatestCguUrl()}`)
    })

    BddTest().then('it applies the Backoffice headers', () => {
      const { headers } = onRequest.mock.calls[0][0]

      expect(headers.get('x-signed-context')).toBe('student')
      expect(headers.get('Accept-Language')).toBe(shared.AvIsoLocaleMap.fr)
      expect(headers.get('Authorization')).toBe(__BEARER_TOKEN__)
      expect(headers.get('Content-Type')).toBe('application/json')
      expect(headers.get('eppn')).toBe(__USER_EPPN__ ?? null)
    })

    BddTest().then('it returns the response through the Backoffice response interceptor', () => {
      expect(result).toEqual(cgu)
    })
  })

  BddTest().when('the locale changes after initialization', () => {
    beforeEach(async () => {
      await api.getLatestCgu()
      i18n.global.locale.value = 'en'
      await api.getLatestCgu()
    })

    BddTest().then('it reads the current application locale for each request', () => {
      expect(onRequest).toHaveBeenCalledTimes(2)
      expect(onRequest.mock.calls[0][0].headers.get('Accept-Language')).toBe(shared.AvIsoLocaleMap.fr)
      expect(onRequest.mock.calls[1][0].headers.get('Accept-Language')).toBe(shared.AvIsoLocaleMap.en)
    })
  })

  BddTest().when('the locale is unsupported', () => {
    beforeEach(async () => {
      i18n.global.locale.value = 'unknown' as AvLocale
      await api.getLatestCgu()
    })

    BddTest().then('it falls back to French', () => {
      expect(onRequest.mock.calls[0][0].headers.get('Accept-Language')).toBe(shared.AvIsoLocaleMap.fr)
    })
  })

  BddTest().when('a shared request includes custom options', () => {
    const controller = new AbortController()
    const requestOptions: RequestInit = {
      headers: {
        'X-Custom-Header': 'custom-value',
        'Authorization': 'Bearer request-token',
      },
      credentials: 'omit',
      cache: 'no-store',
      signal: controller.signal,
    }

    beforeEach(async () => {
      await api.getLatestCgu(requestOptions)
    })

    BddTest().then('it preserves custom options while applying application authentication', () => {
      const request = onRequest.mock.calls[0][0]

      expect(request.headers.get('X-Custom-Header')).toBe('custom-value')
      expect(request.headers.get('Authorization')).toBe(__BEARER_TOKEN__)
      expect(request.credentials).toBe('omit')
      expect(request.cache).toBe('no-store')
      expect(request.signal.aborted).toBe(false)
    })
  })
})
