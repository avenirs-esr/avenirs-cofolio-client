import type { FetchConfig, RequestInterceptor, ResponseInterceptor, ResponseInterceptorContext } from '@avenirs-esr/shared'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { FetchInterceptorManager } from '@avenirs-esr/shared'
import { afterEach, beforeEach, expect, vi } from 'vitest'

const baseUrl = 'https://api.example.test/v1'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

BddTest().given('independent interceptor managers', () => {
  BddTest().when('a manager has no interceptors', () => {
    const manager = new FetchInterceptorManager()
    const options: RequestInit = { headers: { 'X-Original': 'original' } }
    const config: FetchConfig = { baseUrl }
    const response = Response.json({ success: true })
    const context: ResponseInterceptorContext = { url: `${baseUrl}/plain`, options, config }
    let finalOptions: RequestInit
    let finalResponse: Response

    beforeEach(async () => {
      finalOptions = await manager.applyRequestInterceptors('/plain', options, config)
      finalResponse = await manager.applyResponseInterceptors(response, context)
    })

    BddTest().then('it shallow-copies request options but returns the original response by identity', () => {
      expect(finalOptions).toEqual(options)
      expect(finalOptions).not.toBe(options)
      expect(finalOptions.headers).toBe(options.headers)
      expect(finalResponse).toBe(response)
    })
  })

  BddTest().when('interceptors are registered on only one manager', () => {
    const first = new FetchInterceptorManager()
    const second = new FetchInterceptorManager()
    const requestInterceptor = vi.fn<RequestInterceptor>()
    const responseInterceptor = vi.fn<ResponseInterceptor>()
    const config: FetchConfig = { baseUrl }
    const options: RequestInit = { method: 'GET' }
    const response = Response.json({ success: true })
    const context: ResponseInterceptorContext = { url: baseUrl, options, config }
    let finalOptions: RequestInit
    let finalResponse: Response

    beforeEach(async () => {
      first.addRequestInterceptor(requestInterceptor)
      first.addResponseInterceptor(responseInterceptor)
      finalOptions = await second.applyRequestInterceptors('/independent', options, config)
      finalResponse = await second.applyResponseInterceptors(response, context)
    })

    BddTest().then('other managers do not share their interceptor registrations', () => {
      expect(requestInterceptor).not.toHaveBeenCalled()
      expect(responseInterceptor).not.toHaveBeenCalled()
      expect(finalOptions).toEqual(options)
      expect(finalResponse).toBe(response)
    })
  })
})
