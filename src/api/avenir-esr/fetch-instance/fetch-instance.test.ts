import { createCustomFetch, FetchInterceptorManager } from '@/api/fetch'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/api/fetch')

describe('avenir-esr customFetch', () => {
  const mockFetcher = vi.fn()
  const mockAddRequestInterceptor = vi.fn()
  const mockedCreateCustomFetch = vi.mocked(createCustomFetch)
  const mockedFetchInterceptorManager = vi.mocked(FetchInterceptorManager)

  beforeEach(() => {
    mockedFetchInterceptorManager.mockImplementation(() => ({
      addRequestInterceptor: mockAddRequestInterceptor,
      addResponseInterceptor: vi.fn(),
      removeRequestInterceptor: vi.fn(),
      removeResponseInterceptor: vi.fn(),
    }) as unknown as FetchInterceptorManager)

    mockedCreateCustomFetch.mockReturnValue(mockFetcher)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should create FetchInterceptorManager instance', async () => {
    const { customFetch } = await import('./fetch-instance')
    await customFetch('/test', { method: 'GET' })
    expect(mockedFetchInterceptorManager).toHaveBeenCalledTimes(1)
    expect(mockAddRequestInterceptor).toHaveBeenCalledTimes(1)

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

    expect(mockedCreateCustomFetch).toHaveBeenNthCalledWith(1, {
      baseUrl: expect.any(String),
      defaultHeaders: { 'Content-Type': 'application/json' },
    }, expect.any(Object))
  })

  it('should call fetcher when customFetch is invoked', async () => {
    const mockResponse = { data: 'test response' }
    mockFetcher.mockResolvedValueOnce(mockResponse)

    const { customFetch } = await import('./fetch-instance')
    const result = await customFetch('/test', { method: 'GET' })

    expect(mockFetcher).toHaveBeenCalledTimes(1)
    expect(mockFetcher).toHaveBeenCalledWith('/test', { method: 'GET' })
    expect(result).toEqual(mockResponse)
  })

  it('should pass through generic type correctly', async () => {
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

    mockFetcher.mockResolvedValueOnce(mockUser)

    const { customFetch } = await import('./fetch-instance')
    const result = await customFetch<User>('/api/users/1', { method: 'GET' })

    expect(result).toEqual(mockUser)
    expect(result.id).toBe(1)
    expect(result.name).toBe('John Doe')
    expect(result.email).toBe('john@example.com')
  })

  it('should preserve all request options when calling fetcher', async () => {
    const requestOptions: RequestInit = {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer token',
        'X-Custom-Header': 'custom-value'
      },
      body: JSON.stringify({ data: 'test' }),
      signal: new AbortController().signal
    }

    mockFetcher.mockResolvedValueOnce({ success: true })

    const { customFetch } = await import('./fetch-instance')
    await customFetch('/api/data', requestOptions)

    expect(mockFetcher).toHaveBeenCalledWith('/api/data', requestOptions)
  })
})
