import type { QueryClient } from '@tanstack/vue-query'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useQueryClient } from '@tanstack/vue-query'
import { mountComposable } from 'tests/utils'
import { expect, vi } from 'vitest'
import { useInvalidateAllQueriesAfterLocaleChange } from '@/common/composables/use-invalidate-query/use-invalidate-query'

BddTest().given('an useInvalidateAllQueriesAfterLocaleChange composable', () => {
  BddTest().when('locale changes occurs', () => {
    BddTest().then('it should invalidate all queries', async () => {
      const mockInvalidateQueries = vi.fn<QueryClient['invalidateQueries']>().mockResolvedValue(undefined)
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
