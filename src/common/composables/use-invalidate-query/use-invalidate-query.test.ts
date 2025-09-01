import { mountComposable } from '@/ui/tests/utils'
import { useQueryClient } from '@tanstack/vue-query'

import { describe, expect, it, vi } from 'vitest'
import { useInvalidateAllQueriesAfterLocaleChange, useInvalidateQuery } from './use-invalidate-query'

describe('useInvalidateQuery', () => {
  let mockInvalidateQueries: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockInvalidateQueries = vi.fn().mockResolvedValue(undefined)
  })

  describe('given a queryKey', () => {
    const queryKey = ['my', 'query', 'key']

    describe('when the invalidate function is called', () => {
      it('then it should call queryClient.invalidateQueries with the queryKey', async () => {
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

  describe('given no queryKey', () => {
    describe('when the invalidate function is called', () => {
      it('then it should call queryClient.invalidateQueries without queryKey', async () => {
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
  })
})

describe('useInvalidateAllQueriesAfterLocaleChange', () => {
  describe('when locale changes', () => {
    it('then it should invalidate all queries', async () => {
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
