import { i18n } from '@/plugins/vue-i18n'
import { type QueryKey, useQueryClient } from '@tanstack/vue-query'

export function useInvalidateQuery (queryKey?: QueryKey) {
  const queryClient = useQueryClient()
  return async (): Promise<void> => {
    if (queryKey) {
      await queryClient.invalidateQueries({
        queryKey
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
