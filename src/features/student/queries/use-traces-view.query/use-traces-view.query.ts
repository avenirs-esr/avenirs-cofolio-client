import type { TracesViewResponse, TraceViewDTO, UnassociatedTracesSummaryDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { Ref } from 'vue'
import { useInvalidateQuery } from '@/common/composables'
import { createDeletedTraceIdMock, createMockedTracesViewResponse, mockedUnassignedTracesSummary } from '@/features/student/queries/fixtures'
import { useMutation, useQuery, type UseQueryReturnType } from '@tanstack/vue-query'

const commonQueryKeys = ['user', 'student', 'traces']
const unassignedTracesQueryKey = [...commonQueryKeys, 'unassigned']
const TWO_MINUTES = 2 * 60 * 1000

export function useUnassignedTracesViewQuery (
  page: Ref<number>,
  pageSize: Ref<number>
): UseQueryReturnType<TracesViewResponse, BaseApiException> & {
  traces: Ref<TraceViewDTO[]>
  pageInfo: Ref<TracesViewResponse['page']>
} {
  const queryKey = computed(() => [...unassignedTracesQueryKey, { page: page.value, pageSize: pageSize.value }])

  const query = useQuery<TracesViewResponse, BaseApiException, TracesViewResponse, readonly unknown[]>({
    queryKey,
    queryFn: async (): Promise<TracesViewResponse> => {
    /*
      // TODO: Uncomment when the API is ready
      const response = await getTracesView({
        pageSize,
        page: pageParam,
        status: GetTracesViewStatus.UNASSOCIATED
      })
    */
      return createMockedTracesViewResponse(pageSize.value, 20, page.value)
    },
    staleTime: TWO_MINUTES,
  })

  const traces = computed(() => query.data.value?.data.traces ?? [])
  const pageInfo = computed(() => query.data.value?.page ?? { number: 0, pageSize: 0, totalElements: 0, totalPages: 0 })

  return {
    ...query,
    traces,
    pageInfo,
  }
}

export function useUnassignedTracesSummaryQuery (): UseQueryReturnType<UnassociatedTracesSummaryDTO, BaseApiException> {
  const queryKey = computed(() => [...commonQueryKeys, 'unassigned', 'summary'])

  return useQuery<UnassociatedTracesSummaryDTO, BaseApiException>({
    queryKey,
    queryFn: async (): Promise<UnassociatedTracesSummaryDTO> => {
      /*
      // TODO: Uncomment when the API is ready
      const response = await getTracesUnassociatedSummary()
      */
      return mockedUnassignedTracesSummary
    },
    staleTime: TWO_MINUTES,
  })
}

export interface DeleteTraceVariables {
  traceId: string
}

export interface UseDeleteTraceMutationArgs {
  onSuccess?: () => void
  onError?: (error: BaseApiException) => void
}

export function useDeleteTraceMutation ({ onError, onSuccess }: UseDeleteTraceMutationArgs = {}) {
  const invalidateUnassignedTracesViewQuery = useInvalidateQuery(unassignedTracesQueryKey)
  return useMutation<string, BaseApiException, DeleteTraceVariables>({
    mutationFn: async ({ traceId }: DeleteTraceVariables): Promise<string> => {
      /**
       * TODO: Uncomment when the API is ready
       * return await deleteTrace(traceId)
       */
      return createDeletedTraceIdMock(traceId)
    },
    onSuccess: async () => {
      await invalidateUnassignedTracesViewQuery()
      onSuccess?.()
    },
    onError
  })
}
