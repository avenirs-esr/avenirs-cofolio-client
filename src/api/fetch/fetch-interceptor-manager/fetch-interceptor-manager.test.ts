import { FetchInterceptorManager } from '@/api/fetch/fetch-interceptor-manager/fetch-interceptor-manager'
import { describe, expect, it, vi } from 'vitest'

describe('fetchInterceptorManager', () => {
  const dummyConfig = { baseUrl: 'https://avenir.esr.example.com', defaultHeaders: {} }

  it('applies request interceptors in order', async () => {
    const manager = new FetchInterceptorManager()
    const interceptor1 = vi.fn((url, options) => ({ ...options, headers: { ...options.headers, 'x-api-key': 'x11yY' } }))
    const interceptor2 = vi.fn((url, options) => ({ ...options, headers: { ...options.headers, Authorization: 'Bearer Token' } }))
    manager.addRequestInterceptor(interceptor1)
    manager.addRequestInterceptor(interceptor2)

    const result = await manager.applyRequestInterceptors('/me/navigation-access', { headers: {} }, dummyConfig)
    expect(interceptor1).toHaveBeenCalled()
    expect(interceptor2).toHaveBeenCalled()
    expect(result.headers).toMatchObject({ 'x-api-key': 'x11yY', 'Authorization': 'Bearer Token' })
  })

  it('applies response interceptors in order', async () => {
    const manager = new FetchInterceptorManager()
    const response = new Response('{"ok":true}', { status: 200, headers: { 'content-type': 'application/json' } })
    const interceptor1 = vi.fn(async (res: Response) => res)
    const interceptor2 = vi.fn(async (res: Response) => res)
    manager.addResponseInterceptor(interceptor1)
    manager.addResponseInterceptor(interceptor2)

    const result = await manager.applyResponseInterceptors(response)
    expect(interceptor1).toHaveBeenCalled()
    expect(interceptor2).toHaveBeenCalled()
    expect(result).toBe(response)
  })
})
