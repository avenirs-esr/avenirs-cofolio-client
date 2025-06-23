import type { AmsViewDTO, AmsViewResponse, PageInfo } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { Ref } from 'vue'
import { createMockedAmsViewResponse } from '@/features/student/queries/fixtures'

import { useQuery, type UseQueryReturnType } from '@tanstack/vue-query'

const commonQueryKeys = ['user', 'student']

const TWO_MINUTES = 2 * 60 * 1000

export function useAmsViewQuery (
  page: Ref<number>,
  pageSize: Ref<number>
): UseQueryReturnType<AmsViewResponse, BaseApiException> & {
  amss: Ref<AmsViewDTO[]>
  pageInfo: Ref<PageInfo>
} {
  const queryKey = computed(() => [...commonQueryKeys, 'ams', { page: page.value, pageSize: pageSize.value }])

  const query = useQuery<AmsViewResponse, BaseApiException, AmsViewResponse, readonly unknown[]>({
    queryKey,
    queryFn: async (): Promise<AmsViewResponse> => {
    /*
      // TODO: Uncomment when the API is ready
      const response = await getAmsView({
        pageSize,
        page: pageParam
      })
    */
      return createMockedAmsViewResponse(pageSize.value, 20, page.value)
    },
    staleTime: TWO_MINUTES,
  })

  const amss = computed(() => query.data.value?.data ?? [])
  const pageInfo = computed(() => query.data.value?.page ?? { number: 0, pageSize: 0, totalElements: 0, totalPages: 0 })

  return {
    ...query,
    amss,
    pageInfo,
  }
}
