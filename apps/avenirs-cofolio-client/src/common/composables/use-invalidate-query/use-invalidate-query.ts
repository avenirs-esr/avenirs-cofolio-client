import type { QueryKey } from '@tanstack/vue-query'
import { useQueryClient } from '@tanstack/vue-query'
import { i18n } from '@/plugins/vue-i18n'

export function useInvalidateQuery (queryKey?: QueryKey) {
  const queryClient = useQueryClient()

  return async (overrideQueryKey?: QueryKey): Promise<void> => {
    if (queryKey || overrideQueryKey) {
      await queryClient.invalidateQueries({
        queryKey: overrideQueryKey ?? queryKey
      })
    }
    else {
      await queryClient.invalidateQueries()
    }
  }
}

export function useInvalidateAllQueriesAfterLocaleChange () {
  const invalidateQueries = useInvalidateQuery()

  watch(
    i18n.global.locale,
    () => {
      invalidateQueries().catch(() => {})
    }
  )
}
