import type { AvLocale, FetchOptions, ResponseInterceptorContext } from '@avenirs-esr/shared'
import type { CguDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { MockedFunction, MockInstance } from 'vitest'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { HttpStatusCode } from '@avenirs-esr/shared'
import { http, HttpResponse } from 'msw'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { server } from '@/__mocks__/msw/server'
import { ROUTES } from '@/common/constants'
import { SessionCheck } from '@/features/auth/global/stores/auth.store.types'

const mockRevalidateSession = vi.fn()
const mockRedirectToLogin = vi.fn()

vi.mock('@/features/auth/global/stores/auth.store', () => ({
  useAuthStore: vi.fn(() => ({
    revalidateSession: mockRevalidateSession,
    redirectToLogin: mockRedirectToLogin,
  })),
}))

const { mockReplace, mockCurrentRoute, CURRENT_ROUTE } = vi.hoisted(() => {
  const path = '/current-route'

  return {
    mockReplace: vi.fn(),
    mockCurrentRoute: { fullPath: path, meta: {} as { public?: boolean } },
    CURRENT_ROUTE: path,
  }
})

vi.mock('@/router', () => ({
  default: {
    replace: mockReplace,
    currentRoute: { value: mockCurrentRoute },
  },
}))

BddTest().given('the Cofolio shared HTTP configuration', () => {
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

    BddTest().then('it uses the Cofolio API base URL', () => {
      expect(onRequest).toHaveBeenCalledTimes(1)
      expect(onRequest.mock.calls[0][0].url).toBe(`${__BASE_URL__.replace(/\/$/, '')}${api.getGetLatestCguUrl()}`)
    })

    BddTest().then('it applies the Cofolio headers and session credentials', () => {
      const request = onRequest.mock.calls[0][0]

      expect(request.headers.get('x-signed-context')).toBe('student')
      expect(request.headers.get('Accept-Language')).toBe(shared.AvIsoLocaleMap.fr)
      expect(request.headers.get('Authorization')).toBe(__BEARER_TOKEN__)
      expect(request.headers.get('Content-Type')).toBe('application/json')
      expect(request.headers.get('eppn')).toBe(__USER_EPPN__ ?? null)
      expect(request.credentials).toBe('include')
    })

    BddTest().then('it returns the response through the Cofolio response interceptor', () => {
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
    let controller: AbortController

    beforeEach(async () => {
      controller = new AbortController()
      await api.getLatestCgu({
        headers: {
          'X-Custom-Header': 'custom-value',
          'Authorization': 'Bearer request-token',
        },
        credentials: 'omit',
        cache: 'no-store',
        signal: controller.signal,
      })
      controller.abort()
    })

    BddTest().then('it preserves custom options while applying application authentication', () => {
      const request = onRequest.mock.calls[0][0]

      expect(request.headers.get('X-Custom-Header')).toBe('custom-value')
      expect(request.headers.get('Authorization')).toBe(__BEARER_TOKEN__)
      expect(request.credentials).toBe('omit')
      expect(request.cache).toBe('no-store')
      expect(request.signal.aborted).toBe(true)
    })
  })
})

BddTest().given('the Cofolio response interceptor', () => {
  const mockFetch: MockedFunction<typeof fetch> = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch)
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  BddTest().and('a response goes through the response interceptor', () => {
    const mockContext: ResponseInterceptorContext = {
      url: '/me/navigation-access',
      options: {},
      config: {},
    }

    const unauthorized = () => new Response(null, { status: HttpStatusCode.UNAUTHORIZED })

    let interceptor: (response: Response, context: ResponseInterceptorContext) => Promise<Response>

    beforeEach(async () => {
      vi.clearAllMocks()
      vi.resetModules()
      mockRevalidateSession.mockReset()
      mockRedirectToLogin.mockReset()
      mockReplace.mockReset()
      mockFetch.mockReset()
      mockCurrentRoute.meta = {}

      const { FetchInterceptorManager } = await import('@avenirs-esr/shared')
      const addResponseInterceptorSpy = vi.spyOn(FetchInterceptorManager.prototype, 'addResponseInterceptor')

      await import('@/api/avenir-esr/fetch-instance/fetch-instance')
      const responseInterceptor = addResponseInterceptorSpy.mock.calls[0][0]
      interceptor = (response, context) => Promise.resolve(responseInterceptor(response, context))
    })

    BddTest().when('the response is a 401 and /me confirms that the session is still valid', () => {
      let replayed: Response
      let result: Response

      beforeEach(async () => {
        replayed = new Response(JSON.stringify({ success: true }), { status: 200 })
        mockRevalidateSession.mockResolvedValue(SessionCheck.VALID)
        mockFetch.mockResolvedValueOnce(replayed)

        result = await interceptor(unauthorized(), mockContext)
      })

      BddTest().then('should replay the original request once', () => {
        expect(mockFetch).toHaveBeenCalledTimes(1)
        expect(mockFetch).toHaveBeenCalledWith(mockContext.url, mockContext.options)
      })

      BddTest().then('should hand the replayed response back instead of the 401', () => {
        expect(result).toBe(replayed)
      })

      BddTest().then('should not redirect', () => {
        expect(mockRedirectToLogin).not.toHaveBeenCalled()
        expect(mockReplace).not.toHaveBeenCalled()
      })
    })

    BddTest().when('the replayed request answers 401 again', () => {
      let replayed: Response
      let result: Response

      beforeEach(async () => {
        replayed = unauthorized()
        mockRevalidateSession.mockResolvedValue(SessionCheck.VALID)
        mockFetch.mockResolvedValueOnce(replayed)

        result = await interceptor(unauthorized(), mockContext)
      })

      BddTest().then('should hand that 401 back as a regular error instead of looping or redirecting', () => {
        expect(result).toBe(replayed)
        expect(mockRevalidateSession).toHaveBeenCalledTimes(1)
        expect(mockFetch).toHaveBeenCalledTimes(1)
        expect(mockReplace).not.toHaveBeenCalled()
      })
    })

    BddTest().when('the response is a 401 and /me confirms that the user is not authenticated', () => {
      let pending: Promise<Response>

      beforeEach(async () => {
        mockRevalidateSession.mockResolvedValue(SessionCheck.UNAUTHORIZED)
        mockRedirectToLogin.mockReturnValue(ROUTES.AUTH.LOGIN)

        pending = interceptor(unauthorized(), mockContext)

        await vi.waitFor(() => expect(mockReplace).toHaveBeenCalledTimes(1))
      })

      BddTest().then('should ask for the login route with the current route as target', () => {
        expect(mockRedirectToLogin).toHaveBeenCalledTimes(1)
        expect(mockRedirectToLogin).toHaveBeenCalledWith(CURRENT_ROUTE)
      })

      BddTest().then('should replace the current route with the login route without replaying the request', () => {
        expect(mockReplace).toHaveBeenCalledWith(ROUTES.AUTH.LOGIN)
        expect(mockFetch).not.toHaveBeenCalled()
      })

      BddTest().then('should never settle, neither with a response nor with an error', async () => {
        const onSettled = vi.fn()
        pending.then(onSettled, onSettled)

        await new Promise<void>(resolve => setTimeout(resolve, 0))

        expect(onSettled).not.toHaveBeenCalled()
      })
    })

    BddTest().when('the response is a 401, /me confirms the logout and a redirection is already in progress', () => {
      let pending: Promise<Response>

      beforeEach(async () => {
        mockRevalidateSession.mockResolvedValue(SessionCheck.UNAUTHORIZED)
        mockRedirectToLogin.mockReturnValue(undefined)

        pending = interceptor(unauthorized(), mockContext)

        await vi.waitFor(() => expect(mockRedirectToLogin).toHaveBeenCalledTimes(1))
      })

      BddTest().then('should not navigate again and still never settle', async () => {
        const onSettled = vi.fn()
        pending.then(onSettled, onSettled)

        await new Promise<void>(resolve => setTimeout(resolve, 0))

        expect(mockReplace).not.toHaveBeenCalled()
        expect(onSettled).not.toHaveBeenCalled()
      })
    })

    BddTest().when('the response is a 401, /me confirms that the user is not authenticated and the current route is public in development', () => {
      let error: Error | undefined

      beforeEach(async () => {
        error = undefined
        vi.stubEnv('DEV', true)
        mockCurrentRoute.meta = { public: true }
        mockRevalidateSession.mockResolvedValue(SessionCheck.UNAUTHORIZED)

        await interceptor(unauthorized(), mockContext).catch((reason: Error) => {
          error = reason
        })
      })

      BddTest().then('should reject with an error naming the request and the public route', () => {
        expect(error).toBeInstanceOf(Error)
        expect(error?.message).toContain(mockContext.url)
        expect(error?.message).toContain(CURRENT_ROUTE)
      })

      BddTest().then('should neither redirect nor replay the request', () => {
        expect(mockRedirectToLogin).not.toHaveBeenCalled()
        expect(mockReplace).not.toHaveBeenCalled()
        expect(mockFetch).not.toHaveBeenCalled()
      })
    })

    BddTest().when('the response is a 401, /me confirms that the user is not authenticated and the current route is public in production', () => {
      let pending: Promise<Response>

      beforeEach(async () => {
        vi.stubEnv('DEV', false)
        mockCurrentRoute.meta = { public: true }
        mockRevalidateSession.mockResolvedValue(SessionCheck.UNAUTHORIZED)
        mockRedirectToLogin.mockReturnValue(ROUTES.AUTH.LOGIN)

        pending = interceptor(unauthorized(), mockContext)

        await vi.waitFor(() => expect(mockReplace).toHaveBeenCalledTimes(1))
      })

      BddTest().then('should redirect to the login route like on any other route and never settle', async () => {
        const onSettled = vi.fn()
        pending.then(onSettled, onSettled)

        await new Promise<void>(resolve => setTimeout(resolve, 0))

        expect(mockRedirectToLogin).toHaveBeenCalledWith(CURRENT_ROUTE)
        expect(mockReplace).toHaveBeenCalledWith(ROUTES.AUTH.LOGIN)
        expect(onSettled).not.toHaveBeenCalled()
      })
    })

    BddTest().when('the response is a 401 on a public route and /me confirms that the session is still valid', () => {
      let replayed: Response
      let result: Response

      beforeEach(async () => {
        vi.stubEnv('DEV', true)
        mockCurrentRoute.meta = { public: true }
        replayed = new Response(JSON.stringify({ success: true }), { status: 200 })
        mockRevalidateSession.mockResolvedValue(SessionCheck.VALID)
        mockFetch.mockResolvedValueOnce(replayed)

        result = await interceptor(unauthorized(), mockContext)
      })

      BddTest().then('should replay the original request instead of failing', () => {
        expect(result).toBe(replayed)
        expect(mockFetch).toHaveBeenCalledWith(mockContext.url, mockContext.options)
        expect(mockRedirectToLogin).not.toHaveBeenCalled()
      })
    })

    BddTest().when('the response is a 401 but /me itself fails (network, 5xx)', () => {
      const response = unauthorized()
      let result: Response

      beforeEach(async () => {
        mockRevalidateSession.mockResolvedValue(SessionCheck.ERROR)

        result = await interceptor(response, mockContext)
      })

      BddTest().then('should hand the original 401 back without redirecting nor replaying', () => {
        expect(result).toBe(response)
        expect(mockRedirectToLogin).not.toHaveBeenCalled()
        expect(mockReplace).not.toHaveBeenCalled()
        expect(mockFetch).not.toHaveBeenCalled()
      })
    })

    BddTest().when('the 401 comes from a request flagged with skipUnauthorizedHandling', () => {
      const response = unauthorized()
      const options: FetchOptions = { skipUnauthorizedHandling: true }
      let result: Response

      beforeEach(async () => {
        result = await interceptor(response, { ...mockContext, options })
      })

      BddTest().then('should hand the response back without checking the session', () => {
        expect(result).toBe(response)
        expect(mockRevalidateSession).not.toHaveBeenCalled()
        expect(mockReplace).not.toHaveBeenCalled()
      })
    })

    BddTest().when('the 401 comes from a request flagged with skipUnauthorizedHandling on a public route', () => {
      const response = unauthorized()
      const options: FetchOptions = { skipUnauthorizedHandling: true }
      let result: Response

      beforeEach(async () => {
        vi.stubEnv('DEV', true)
        mockCurrentRoute.meta = { public: true }

        result = await interceptor(response, { ...mockContext, options })
      })

      BddTest().then('should hand the response back instead of failing', () => {
        expect(result).toBe(response)
        expect(mockRevalidateSession).not.toHaveBeenCalled()
        expect(mockReplace).not.toHaveBeenCalled()
      })
    })

    BddTest().when('the response is not a 401', () => {
      const response = new Response(null, { status: 403 })
      let result: Response

      beforeEach(async () => {
        result = await interceptor(response, mockContext)
      })

      BddTest().then('should hand the response back without checking the session', () => {
        expect(result).toBe(response)
        expect(mockRevalidateSession).not.toHaveBeenCalled()
        expect(mockReplace).not.toHaveBeenCalled()
      })
    })
  })
})
