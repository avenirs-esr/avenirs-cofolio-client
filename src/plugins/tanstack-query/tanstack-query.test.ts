import TanstackQueryPlugin from '@/plugins/tanstack-query/tanstack-query'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { BddTest } from 'tests/utils'
import { expect, vi } from 'vitest'

const useMock = vi.fn()
const appMock = { use: useMock }

BddTest().given('a tanstack query plugin', () => {
  BddTest().when('installing the plugin', () => {
    BddTest().then('it should install VueQueryPlugin with correct options', () => {
      TanstackQueryPlugin.install(appMock as any)

      expect(useMock).toHaveBeenCalledOnce()
      expect(useMock).toHaveBeenCalledWith(VueQueryPlugin, {
        queryClientConfig: {
          defaultOptions: {
            queries: {
              retry: 3,
            },
            mutations: {
              retry: 1,
            },
          },
        },
      })
    })
  })
})
