import type { MockedFunction } from 'vitest'
import type { FetchOptions, ResponseInterceptorContext } from '@/api/fetch'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { createCustomFetch, FetchInterceptorManager } from '@/api/fetch'
import { ROUTES } from '@/common/constants'
import { HttpStatusCode } from '@/common/utils'
import { SessionCheck } from '@/features/auth/global/stores/auth.store.types'

const mockAddRequestInterceptor = vi.fn()
const mockAddResponseInterceptor = vi.fn()
const mockRemoveRequestInterceptor = vi.fn()
const mockRemoveResponseInterceptor = vi.fn()

function createFetchInterceptorManagerMock () {
  return {
    addRequestInterceptor: mockAddRequestInterceptor,
    addResponseInterceptor: mockAddResponseInterceptor,
    removeRequestInterceptor: mockRemoveRequestInterceptor,
    removeResponseInterceptor: mockRemoveResponseInterceptor,
  }
}

vi.mock('@/api/fetch', () => ({
  createCustomFetch: vi.fn(),
  FetchInterceptorManager: vi.fn(createFetchInterceptorManagerMock),
}))

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

BddTest().given('avenir-esr customFetch', () => {
  const mockFetcher = vi.fn()
  const mockFetch: MockedFunction<typeof fetch> = vi.fn()

  const mockedCreateCustomFetch = vi.mocked(createCustomFetch)
  const mockedFetchInterceptorManager = vi.mocked(FetchInterceptorManager)

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch)

    mockedCreateCustomFetch.mockReturnValue(mockFetcher)

    mockFetch.mockResolvedValue(new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }))
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  BddTest().and('a fresh module import', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      vi.resetModules()
    })

    BddTest().when('customFetch is called', () => {
      beforeEach(async () => {
        const { customFetch } = await import('./fetch-instance')
        await customFetch('/test', { method: 'GET' })
      })

      BddTest().then('should create FetchInterceptorManager instance', () => {
        expect(mockedFetchInterceptorManager).toHaveBeenCalledTimes(1)
        expect(mockAddRequestInterceptor).toHaveBeenCalledTimes(1)
        expect(mockAddResponseInterceptor).toHaveBeenCalledTimes(1)
      })

      BddTest().then('should call createCustomFetch with correct parameters', () => {
        expect(mockedCreateCustomFetch).toHaveBeenCalledWith({
          baseUrl: expect.any(String),
          defaultHeaders: { 'Content-Type': 'application/json' },
        }, expect.any(Object))
      })

      BddTest().then('should call the fetcher with correct parameters', () => {
        expect(mockFetcher).toHaveBeenCalledWith('/test', { method: 'GET' })
      })

      BddTest().then('should add x-signed-context header through interceptor', () => {
        const interceptorCall = mockAddRequestInterceptor.mock.calls[0]
        const interceptorFunction = interceptorCall[0]
        const testOptions: RequestInit = {
          method: 'POST',
        }
        const result = interceptorFunction('https://api.example.com/test', testOptions)
        expect(result).toEqual({
          method: 'POST',
          headers: {
            'Accept-Language': 'en-US',
            'Authorization': __BEARER_TOKEN__,
            'x-signed-context': 'student'
          }
        })
      })
    })
  })

  BddTest().and('a mock response is configured', () => {
    const mockResponse = { data: 'test response' }

    beforeEach(() => {
      mockFetcher.mockResolvedValueOnce(mockResponse)
      vi.clearAllMocks()
      vi.resetModules()
    })

    BddTest().when('customFetch is invoked', () => {
      let result: unknown

      beforeEach(async () => {
        const { customFetch } = await import('./fetch-instance')
        result = await customFetch('/test', { method: 'GET' })
      })

      BddTest().then('should return the mocked response', () => {
        expect(mockFetcher).toHaveBeenCalledWith('/test', { method: 'GET' })
        expect(result).toEqual(mockResponse)
      })
    })
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

      await import('./fetch-instance')
      interceptor = mockAddResponseInterceptor.mock.calls[0][0]
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

        await flushPromises()

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

        await flushPromises()

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

        await flushPromises()

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

  BddTest().and('a User interface and mock user data', () => {
    interface User {
      id: number
      name: string
      email: string
    }

    const mockUser: User = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com'
    }

    beforeEach(() => {
      mockFetcher.mockResolvedValueOnce(mockUser)
      vi.clearAllMocks()
      vi.resetModules()
    })

    BddTest().when('customFetch is called with generic type', () => {
      let result: User

      beforeEach(async () => {
        const { customFetch } = await import('./fetch-instance')
        result = await customFetch<User>('/api/users/1', { method: 'GET' })
      })

      BddTest().then('should pass through generic type correctly', () => {
        expect(result).toEqual(mockUser)
        expect(result.id).toBe(1)
        expect(result.name).toBe('John Doe')
        expect(result.email).toBe('john@example.com')
      })
    })
  })

  BddTest().and('complex request options', () => {
    const requestOptions: RequestInit = {
      method: 'PUT',
      headers: {
        'Authorization': __BEARER_TOKEN__,
        'X-Custom-Header': 'custom-value'
      },
      body: JSON.stringify({ data: 'test' }),
      signal: new AbortController().signal
    }

    beforeEach(() => {
      mockFetcher.mockResolvedValueOnce({ success: true })
      vi.clearAllMocks()
      vi.resetModules()
    })

    BddTest().when('customFetch is called with complex options', () => {
      beforeEach(async () => {
        const { customFetch } = await import('./fetch-instance')
        await customFetch('/api/data', requestOptions)
      })

      BddTest().then('should preserve all request options when calling fetcher', () => {
        expect(mockFetcher).toHaveBeenCalledWith('/api/data', requestOptions)
      })
    })
  })

  BddTest().and('a module is imported', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      vi.resetModules()
      await import('./fetch-instance')
    })

    BddTest().when('module initialization occurs', () => {
      BddTest().then('should call createCustomFetch during initialization', () => {
        expect(mockedCreateCustomFetch).toHaveBeenCalledTimes(1)
        expect(mockedCreateCustomFetch).toHaveBeenCalledWith(
          {
            baseUrl: expect.any(String),
            defaultHeaders: { 'Content-Type': 'application/json' },
          },
          expect.any(Object)
        )
      })

      BddTest().then('should instantiate FetchInterceptorManager during initialization', () => {
        expect(mockedFetchInterceptorManager).toHaveBeenCalledTimes(1)
        expect(mockAddRequestInterceptor).toHaveBeenCalledTimes(1)
        expect(mockAddRequestInterceptor).toHaveBeenCalledWith(expect.any(Function))
      })
    })
  })
})
