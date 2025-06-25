import { createCustomFetch } from '@/api/fetch/fetch-factory/fetch-factory'
import { FetchInterceptorManager } from '@/api/fetch/fetch-interceptor-manager/fetch-interceptor-manager'
import { BaseApiErrorCode, BaseApiException } from '@/common/exceptions'
import { beforeEach, describe, expect, it, type MockedFunction, vi } from 'vitest'

describe('createCustomFetch', () => {
  const baseUrl = 'https://avenir.esr.example.com'
  const defaultHeaders = { 'Content-Type': 'application/json', 'X-Default': '1' }
  let interceptorManager: FetchInterceptorManager
  const mockFetch: MockedFunction<typeof fetch> = vi.fn()

  beforeEach(() => {
    interceptorManager = new FetchInterceptorManager()
    vi.stubGlobal('fetch', mockFetch)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('builds the correct URL with baseUrl', async () => {
    const headers = new Headers()
    headers.set('Content-Type', 'application/json')
    vi.mocked(mockFetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), { status: 200, headers })
    )
    const fetcher = createCustomFetch({ baseUrl }, interceptorManager)
    await fetcher('/me/navigation-access', { headers })
    expect(mockFetch).toHaveBeenCalledWith('https://avenir.esr.example.com/me/navigation-access', expect.any(Object))
  })

  it('builds the URL without baseUrl', async () => {
    vi.mocked(mockFetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': '' } })
    )
    const fetcher = createCustomFetch({ baseUrl, defaultHeaders }, interceptorManager)
    await fetcher('https://avenir.esr.example.com/me/navigation-access', {})
    expect(mockFetch).toHaveBeenCalledWith('https://avenir.esr.example.com/me/navigation-access', expect.any(Object))
  })

  it('merges default and request headers', async () => {
    vi.mocked(mockFetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } })
    )
    const fetcher = createCustomFetch({ baseUrl, defaultHeaders }, interceptorManager)
    await fetcher('me/navigation-access', { headers: [['content-type', 'application/json'], ['X-Country', 'fr']] })
    const expectedHeaders = new Headers()
    expectedHeaders.set('Content-Type', 'application/json')
    expectedHeaders.set('X-Default', '1')
    expectedHeaders.set('X-Country', 'fr')
    expect(mockFetch).toHaveBeenCalledWith('https://avenir.esr.example.com/me/navigation-access', { headers: expectedHeaders })
  })

  it('returns JSON body for application/json', async () => {
    const responseBody = {
      APC: {
        enabledByInstitution: true,
        hasProgram: false
      },
      LIFE_PROJECT: {
        enabledByInstitution: true
      }
    }
    vi.mocked(mockFetch).mockResolvedValueOnce(
      new Response(JSON.stringify(responseBody), { status: 200, headers: { 'content-type': 'application/json' } })
    )
    const fetcher = createCustomFetch({ baseUrl }, interceptorManager)
    const result = await fetcher<typeof responseBody>('/me/navigation-access')
    expect(result).toEqual(responseBody)
  })

  it('returns body for application/pdf', async () => {
    const pdfContent = 'PDF content'
    vi.mocked(mockFetch).mockResolvedValueOnce(
      new Response(pdfContent, { status: 200, headers: { 'content-type': 'application/pdf' } })
    )
    const fetcher = createCustomFetch({ baseUrl }, interceptorManager)
    const result = await fetcher<Blob>('/me/resumes')
    const responseText = await result.text()
    expect(responseText).toBe(pdfContent)
  })

  it('returns body for application/octet-stream', async () => {
    const content = 'Binary content'
    vi.mocked(mockFetch).mockResolvedValueOnce(
      new Response(content, { status: 200, headers: { 'content-type': 'application/octet-stream' } })
    )
    const fetcher = createCustomFetch({ baseUrl }, interceptorManager)
    const result = await fetcher<ArrayBuffer>('/me/resumes')
    const decoder = new TextDecoder()
    const responseText = decoder.decode(result)
    expect(responseText).toBe(content)
  })

  it('returns body for text/plain', async () => {
    const content = 'text content'
    vi.mocked(mockFetch).mockResolvedValueOnce(
      new Response(content, { status: 200, headers: { 'content-type': 'text/plain' } })
    )
    const fetcher = createCustomFetch({ baseUrl }, interceptorManager)
    const result = await fetcher<string>('/me/resumes')
    expect(result).toBe(content)
  })

  it('throws fetch error on non-ok response', async () => {
    vi.mocked(mockFetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ error: 'fail', message: 'Invalid email' }), { status: 400, statusText: 'Bad Request', headers: { 'content-type': 'application/json' } })
    )
    const fetcher = createCustomFetch({ baseUrl }, interceptorManager)
    try {
      await fetcher('/fail')
    }
    catch (err: any) {
      expect(err).toBeInstanceOf(BaseApiException)
      expect(err).toMatchObject({
        status: 400,
        code: BaseApiErrorCode.BAD_REQUEST,
        method: 'GET',
        name: 'BaseApiException'
      })
      expect(err.message).toBe('Invalid email')
    }
  })

  it('applies request and response interceptors', async () => {
    const reqSpy = vi.fn((url, options) => ({ ...options, headers: { ...options.headers, 'X-Test': 'yes' } }))
    const resSpy = vi.fn(async r => r)
    interceptorManager.addRequestInterceptor(reqSpy)
    interceptorManager.addResponseInterceptor(resSpy)
    vi.mocked(mockFetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } })
    )
    const fetcher = createCustomFetch({ baseUrl }, interceptorManager)
    await fetcher('/test', {})
    expect(reqSpy).toHaveBeenCalled()
    expect(resSpy).toHaveBeenCalled()
  })

  it('catch thrown error while applying interceptors', async () => {
    const message = 'Interceptor error'
    const reqSpy = vi.fn(() => {
      throw new Error('Interceptor error')
    })
    interceptorManager.addRequestInterceptor(reqSpy)

    const fetcher = createCustomFetch({ baseUrl }, interceptorManager)
    await expect(fetcher('/test', {})).rejects.toThrow(message)
  })
})
