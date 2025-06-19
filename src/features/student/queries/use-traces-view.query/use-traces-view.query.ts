import type { TracesViewResponse } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { Ref } from 'vue'
import { createMockedTracesViewResponse } from '@/features/student/queries/fixtures'
import { useQuery, type UseQueryReturnType } from '@tanstack/vue-query'

const commonQueryKeys = ['user', 'student']

export function useTracesViewQuery (page: Ref<number>, paginationSize: Ref<number>): UseQueryReturnType<TracesViewResponse, BaseApiException> {
  const queryKey = computed(() => [...commonQueryKeys, 'traces', { page: page.value, paginationSize: paginationSize.value }])
  return useQuery<TracesViewResponse, BaseApiException>({
    queryKey,
    // TODO: call /traces/view when the endpoint and client are ready
    queryFn: async (): Promise<TracesViewResponse> => {
      const mockedTracesViewResponse = createMockedTracesViewResponse(paginationSize.value, 20, page.value)
      return mockedTracesViewResponse
    }
  })
}
