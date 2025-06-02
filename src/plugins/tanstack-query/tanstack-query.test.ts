import { VueQueryPlugin } from '@tanstack/vue-query'
import { describe, expect, it, vi } from 'vitest'
import TanstackQueryPlugin from './tanstack-query'

const useMock = vi.fn()
const appMock = { use: useMock }

describe('tanstackQueryPlugin', () => {
  it('should install VueQueryPlugin with correct options', () => {
    TanstackQueryPlugin.install(appMock as any)

    expect(useMock).toHaveBeenCalledOnce()
    expect(useMock).toHaveBeenCalledWith(VueQueryPlugin, {
      queryClientConfig: {
        defaultOptions: {
          queries: {
            retry: 3,
          },
          mutations: {
            retry: 2,
          },
        },
      },
    })
  })
})
