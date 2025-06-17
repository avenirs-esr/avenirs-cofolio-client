import type { BaseApiException } from '@/common/exceptions'
import type { AmsViewResponse } from '@/types'
import { mockedAmssPagination } from '@/features/student/queries/fixtures'
import { useQuery, type UseQueryReturnType } from '@tanstack/vue-query'

const commonQueryKeys = ['user', 'student']

export function useAmsViewQuery (page: number, pageSize: number): UseQueryReturnType<AmsViewResponse, BaseApiException> {
  const queryKey = computed(() => [...commonQueryKeys, 'amss', { page, pageSize }])
  return useQuery<AmsViewResponse, BaseApiException>({
    queryKey,
    // TODO: call /ams/view when the endpoint and client are ready
    queryFn: async (): Promise<AmsViewResponse> => {
      return mockedAmssPagination
    }
  })
}
