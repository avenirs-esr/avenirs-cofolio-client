import { type QueryKey, useQueryClient } from '@tanstack/vue-query'

export function useInvalidateQuery (queryKey: QueryKey) {
  const queryClient = useQueryClient()
  return async (): Promise<void> => {
    await queryClient.invalidateQueries({
      queryKey
    })
  }
}
