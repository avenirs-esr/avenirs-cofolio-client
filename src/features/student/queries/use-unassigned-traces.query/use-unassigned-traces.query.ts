import type { TracesResponse, TracesViewResponse, TraceViewDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { PaginatedResponse } from '@/types'
import { defaultGetNextPageParam, useAvInfiniteQuery } from '@/common/composables/use-infinite-pagination/use-infinite-pagination'
import { PageSizes } from '@/config'
import { mockedTracesByPage, mockedTracesByPageSize8, mockedTracesByPageSize12 } from '@/features/student/queries/fixtures'
import { useQuery, useQueryClient } from '@tanstack/vue-query'

function mapToPaginatedTraces (response: TracesViewResponse): PaginatedResponse<TraceViewDTO[]> {
  return {
    data: response.data.traces,
    page: response.page
  }
}

/**
 * TODO: Remove this function when the API is ready
 */
async function getMockedTraces (pageParam: number, pageSize: number): Promise<PaginatedResponse<TracesResponse>> {
  if (pageSize === PageSizes.EIGHT) {
    return mockedTracesByPageSize8[pageParam]
  }
  if (pageSize === PageSizes.TWELVE) {
    return mockedTracesByPageSize12[pageParam]
  }
  return mockedTracesByPage[pageParam]
}

const commonQueryKeys = ['student', 'unassignedTraces']
const unassignedTracesCriticalCountQueryKey = [...commonQueryKeys, 'criticalCount']

const TWO_MINUTES = 2 * 60 * 1000

export function useUnassignedTracesQuery (pageSize: PageSizes) {
  const queryClient = useQueryClient()

  return useAvInfiniteQuery<TraceViewDTO[]>({
    queryKey: computed(() => [...commonQueryKeys, 'list', pageSize]),
    queryFn: async ({ pageParam = 0 }) => {
      const response = await getMockedTraces(pageParam, pageSize)
      /*
      // TODO: Uncomment when the API is ready
      const response = await getTracesView({
        pageSize,
        page: pageParam,
        status: GetTracesViewStatus.UNASSOCIATED
      })
      */
      queryClient.setQueryData(
        unassignedTracesCriticalCountQueryKey,
        response.data.criticalCount
      )
      return mapToPaginatedTraces(response)
    },
    getNextPageParam: defaultGetNextPageParam,
    initialPageParam: 0,
    staleTime: TWO_MINUTES,
  })
}

export function useUnassignedTracesCriticalCount () {
  const queryClient = useQueryClient()

  const cachedCriticalCount = computed(() => {
    return queryClient.getQueryData<number>(unassignedTracesCriticalCountQueryKey)
  })

  return useQuery<number | undefined, BaseApiException, number | undefined>({
    queryKey: unassignedTracesCriticalCountQueryKey,
    queryFn: async () => undefined,
    staleTime: Infinity,
    enabled: computed(() => cachedCriticalCount.value === undefined),
    initialData: () => cachedCriticalCount.value
  })
}
