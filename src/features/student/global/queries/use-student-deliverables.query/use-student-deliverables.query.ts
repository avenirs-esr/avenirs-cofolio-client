import type { BaseApiException } from '@/common/exceptions'
import type { DeliverableOverviewDTO } from '@/types'
import { mockedDeliverablesOverview } from '@/__mocks__/fixtures/student'
import { commonQueryKeys } from '@/features/student/global'
import { useQuery, type UseQueryDefinedReturnType } from '@tanstack/vue-query'

const deliverablesCommonQueryKeys = [...commonQueryKeys, 'deliverables']

export function useStudentDeliverablesSummaryQuery (): UseQueryDefinedReturnType<DeliverableOverviewDTO[], BaseApiException> {
  const queryKey = computed(() => [...deliverablesCommonQueryKeys, 'summary'])
  return useQuery<DeliverableOverviewDTO[], BaseApiException>({
    queryKey,
    initialData: [],
    // TODO: call /me/formations/deliverables/overview when the endpoint and client are ready
    queryFn: async (): Promise<DeliverableOverviewDTO[]> => {
      return mockedDeliverablesOverview
    }
  })
}
