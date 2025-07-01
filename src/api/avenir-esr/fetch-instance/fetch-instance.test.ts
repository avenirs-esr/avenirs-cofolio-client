import { createCustomFetch, FetchInterceptorManager } from '@/api/fetch'

import { afterEach, beforeEach, describe, expect, it, type MockedFunction, vi } from 'vitest'

vi.mock('@/api/fetch', () => ({
  createCustomFetch: vi.fn(),
  FetchInterceptorManager: vi.fn(),
}))

describe('avenir-esr customFetch', () => {
  const mockFetcher = vi.fn()
  const mockAddRequestInterceptor = vi.fn()
  const mockAddResponseInterceptor = vi.fn()
  const mockRemoveRequestInterceptor = vi.fn()
  const mockRemoveResponseInterceptor = vi.fn()
  const mockFetch: MockedFunction<typeof fetch> = vi.fn()

  const mockedCreateCustomFetch = vi.mocked(createCustomFetch)
  const mockedFetchInterceptorManager = vi.mocked(FetchInterceptorManager)

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch)

    mockedFetchInterceptorManager.mockImplementation(() => ({
      addRequestInterceptor: mockAddRequestInterceptor,
      addResponseInterceptor: mockAddResponseInterceptor,
      removeRequestInterceptor: mockRemoveRequestInterceptor,
      removeResponseInterceptor: mockRemoveResponseInterceptor,
    }) as unknown as FetchInterceptorManager)

    mockedCreateCustomFetch.mockReturnValue(mockFetcher)

    mockFetch.mockResolvedValue(new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }))
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.unstubAllGlobals()
  })

  describe('given a fresh module import', () => {
    beforeEach(() => {
      vi.resetModules()
    })

    describe('when customFetch is called', () => {
      beforeEach(async () => {
        const { customFetch } = await import('./fetch-instance')
        await customFetch('/test', { method: 'GET' })
      })

      it('then should create FetchInterceptorManager instance', () => {
        expect(mockedFetchInterceptorManager).toHaveBeenCalledTimes(1)
        expect(mockAddRequestInterceptor).toHaveBeenCalledTimes(1)
      })

      it('then should call createCustomFetch with correct parameters', () => {
        expect(mockedCreateCustomFetch).toHaveBeenCalledWith({
          baseUrl: expect.any(String),
          defaultHeaders: { 'Content-Type': 'application/json' },
        }, expect.any(Object))
      })

      it('then should call the fetcher with correct parameters', () => {
        expect(mockFetcher).toHaveBeenCalledWith('/test', { method: 'GET' })
      })

      it('then should add x-signed-context header through interceptor', () => {
        const interceptorCall = mockAddRequestInterceptor.mock.calls[0]
        const interceptorFunction = interceptorCall[0]
        const testOptions: RequestInit = {
          method: 'POST',
          headers: {
            Authorization: 'Bearer token123'
          }
        }
        const result = interceptorFunction('https://api.example.com/test', testOptions)
        expect(result).toEqual({
          method: 'POST',
          headers: {
            'Authorization': 'Bearer token123',
            'x-signed-context': 'student'
          }
        })
      })
    })
  })

  describe('given a mock response is configured', () => {
    const mockResponse = { data: 'test response' }

    beforeEach(() => {
      mockFetcher.mockResolvedValueOnce(mockResponse)
      vi.resetModules()
    })

    describe('when customFetch is invoked', () => {
      let result: unknown

      beforeEach(async () => {
        const { customFetch } = await import('./fetch-instance')
        result = await customFetch('/test', { method: 'GET' })
      })

      it('then should return the mocked response', () => {
        expect(mockFetcher).toHaveBeenCalledWith('/test', { method: 'GET' })
        expect(result).toEqual(mockResponse)
      })
    })
  })

  describe('given a User interface and mock user data', () => {
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
      vi.resetModules()
    })

    describe('when customFetch is called with generic type', () => {
      let result: User

      beforeEach(async () => {
        const { customFetch } = await import('./fetch-instance')
        result = await customFetch<User>('/api/users/1', { method: 'GET' })
      })

      it('then should pass through generic type correctly', () => {
        expect(result).toEqual(mockUser)
        expect(result.id).toBe(1)
        expect(result.name).toBe('John Doe')
        expect(result.email).toBe('john@example.com')
      })
    })
  })

  describe('given complex request options', () => {
    const requestOptions: RequestInit = {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer token',
        'X-Custom-Header': 'custom-value'
      },
      body: JSON.stringify({ data: 'test' }),
      signal: new AbortController().signal
    }

    beforeEach(() => {
      mockFetcher.mockResolvedValueOnce({ success: true })
      vi.resetModules()
    })

    describe('when customFetch is called with complex options', () => {
      beforeEach(async () => {
        const { customFetch } = await import('./fetch-instance')
        await customFetch('/api/data', requestOptions)
      })

      it('then should preserve all request options when calling fetcher', () => {
        expect(mockFetcher).toHaveBeenCalledWith('/api/data', requestOptions)
      })
    })
  })

  describe('given a module is imported', () => {
    beforeEach(async () => {
      vi.resetModules()
      await import('./fetch-instance')
    })

    describe('when module initialization occurs', () => {
      it('then should call createCustomFetch during initialization', () => {
        expect(mockedCreateCustomFetch).toHaveBeenCalledTimes(1)
        expect(mockedCreateCustomFetch).toHaveBeenCalledWith(
          {
            baseUrl: expect.any(String),
            defaultHeaders: { 'Content-Type': 'application/json' },
          },
          expect.any(Object)
        )
      })

      it('then should instantiate FetchInterceptorManager during initialization', () => {
        expect(mockedFetchInterceptorManager).toHaveBeenCalledTimes(1)
        expect(mockAddRequestInterceptor).toHaveBeenCalledTimes(1)
        expect(mockAddRequestInterceptor).toHaveBeenCalledWith(expect.any(Function))
      })
    })
  })
})
