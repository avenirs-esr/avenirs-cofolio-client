import { ROUTES } from '@/common/constants'
import { BaseApiException } from '@/common/exceptions'
import TanstackQueryPlugin from '@/plugins/tanstack-query/tanstack-query'
import router from '@/router'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { MutationCache, QueryCache, VueQueryPlugin } from '@tanstack/vue-query'
import { expect, vi } from 'vitest'

const useMock = vi.fn()
const appMock = { use: useMock }

vi.mock('@/router', () => ({
  default: {
    push: vi.fn(),
    currentRoute: { value: { fullPath: '/current-route' } },
  },
}))

TanstackQueryPlugin.install(appMock as any)
const [plugin, { queryClientConfig }] = useMock.mock.calls[0]
const queryOnError = queryClientConfig.queryCache.config.onError
const mutationOnError = queryClientConfig.mutationCache.config.onError
const queriesRetry = queryClientConfig.defaultOptions.queries.retry
const mutationsRetry = queryClientConfig.defaultOptions.mutations.retry

const error401 = new BaseApiException('Unauthorized', 401)
const error500 = new BaseApiException('Server Error', 500)

BddTest().given('a tanstack query plugin', () => {
  BddTest().when('installing the plugin', () => {
    BddTest().then('it should install VueQueryPlugin', () => {
      expect(plugin).toBe(VueQueryPlugin)
    })

    BddTest().then('it should have a QueryCache', () => {
      expect(queryClientConfig.queryCache).toBeInstanceOf(QueryCache)
    })

    BddTest().then('it should have a MutationCache', () => {
      expect(queryClientConfig.mutationCache).toBeInstanceOf(MutationCache)
    })
  })

  BddTest().when('a query fails with a 401', () => {
    BddTest().then('it should redirect to login with the current path as redirect param', () => {
      queryOnError(error401)
      expect(router.push).toHaveBeenCalledWith({
        name: ROUTES.AUTH.LOGIN.name,
        query: { redirect: '/current-route' },
      })
    })

    BddTest().then('it should not retry', () => {
      expect(queriesRetry(0, error401)).toBe(false)
    })
  })

  BddTest().when('a query fails with a non-401 error', () => {
    BddTest().then('it should retry up to 2 times', () => {
      expect(queriesRetry(0, error500)).toBe(true)
      expect(queriesRetry(1, error500)).toBe(true)
      expect(queriesRetry(2, error500)).toBe(false)
    })
  })

  BddTest().when('a mutation fails with a 401', () => {
    BddTest().then('it should redirect to login with the current path as redirect param', () => {
      mutationOnError(error401)
      expect(router.push).toHaveBeenCalledWith({
        name: ROUTES.AUTH.LOGIN.name,
        query: { redirect: '/current-route' },
      })
    })

    BddTest().then('it should not retry', () => {
      expect(mutationsRetry(0, error401)).toBe(false)
    })
  })

  BddTest().when('a mutation fails with a non-401 error', () => {
    BddTest().then('it should retry up to 1 time', () => {
      expect(mutationsRetry(0, error500)).toBe(true)
      expect(mutationsRetry(1, error500)).toBe(false)
    })
  })
})
