import { useQueryClient } from '@tanstack/vue-query'
import { BddTest, mountComposable } from 'tests/utils'
import { expect, vi } from 'vitest'
import { useInvalidateAllQueriesAfterLocaleChange, useInvalidateQuery } from './use-invalidate-query'

BddTest().given('an useInvalidateQuery composable', () => {
  let mockInvalidateQueries: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockInvalidateQueries = vi.fn().mockResolvedValue(undefined)
  })

  BddTest().and('a queryKey is defined', () => {
    const queryKey = ['my', 'query', 'key']

    BddTest().when('the invalidate function is called', () => {
      BddTest().then('it should call queryClient.invalidateQueries with the queryKey', async () => {
        const { result } = mountComposable(() => {
          const queryClient = useQueryClient()
          vi.spyOn(queryClient, 'invalidateQueries').mockImplementation(mockInvalidateQueries)
          return useInvalidateQuery(queryKey)
        }, {
          useTanstack: true,
          queryClientConfig: {
            defaultOptions: {
              queries: { retry: false },
              mutations: { retry: false }
            }
          }
        })

        await result()

        expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey })
      })
    })
  })

  BddTest().and('no queryKey', () => {
    BddTest().when('the invalidate function is called', () => {
      BddTest().then('it should call queryClient.invalidateQueries without queryKey', async () => {
        const { result } = mountComposable(() => {
          const queryClient = useQueryClient()
          vi.spyOn(queryClient, 'invalidateQueries').mockImplementation(mockInvalidateQueries)
          return useInvalidateQuery()
        }, {
          useTanstack: true,
          queryClientConfig: {
            defaultOptions: {
              queries: { retry: false },
              mutations: { retry: false }
            }
          }
        })

        await result()

        expect(mockInvalidateQueries).toHaveBeenCalledWith()
      })
    })
    BddTest().when('the invalidate function is called with override key', () => {
      BddTest().then('it should call queryClient.invalidateQueries without override queryKey', async () => {
        const { result } = mountComposable(() => {
          const queryClient = useQueryClient()
          vi.spyOn(queryClient, 'invalidateQueries').mockImplementation(mockInvalidateQueries)
          return useInvalidateQuery()
        }, {
          useTanstack: true,
          queryClientConfig: {
            defaultOptions: {
              queries: { retry: false },
              mutations: { retry: false }
            }
          }
        })

        await result(['custom-key'])

        expect(mockInvalidateQueries).toHaveBeenCalledWith({
          queryKey: ['custom-key']
        })
      })
    })
  })
})

BddTest().given('an useInvalidateAllQueriesAfterLocaleChange composable', () => {
  BddTest().when('locale changes occurs', () => {
    BddTest().then('it should invalidate all queries', async () => {
      const mockInvalidateQueries = vi.fn().mockResolvedValue(undefined)
      mountComposable(() => {
        const queryClient = useQueryClient()
        vi.spyOn(queryClient, 'invalidateQueries').mockImplementation(mockInvalidateQueries)
        useInvalidateAllQueriesAfterLocaleChange()
      }, {
        useTanstack: true,
        queryClientConfig: {
          defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false }
          }
        }
      })

      const { i18n } = await import('@/plugins/vue-i18n')
      i18n.global.locale.value = 'en'

      await vi.waitFor(() => {
        expect(mockInvalidateQueries).toHaveBeenCalled()
      })
    })
  })
})
