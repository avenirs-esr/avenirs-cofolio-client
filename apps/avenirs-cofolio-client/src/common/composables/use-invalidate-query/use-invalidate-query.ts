import { useQueryClient } from '@tanstack/vue-query'
import { i18n } from '@/plugins/vue-i18n'

export function useInvalidateAllQueriesAfterLocaleChange () {
  const queryClient = useQueryClient()

  watch(
    i18n.global.locale,
    async () => {
      await queryClient.invalidateQueries()
    }
  )
}
