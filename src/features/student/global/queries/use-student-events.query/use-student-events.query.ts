import type { BaseApiException } from '@/common/exceptions'
import type { EventOverviewDTO } from '@/types'
import { mockedEventsOverview } from '@/__mocks__/fixtures/student'
import { commonQueryKeys } from '@/features/student/global'
import { useQuery, type UseQueryDefinedReturnType } from '@tanstack/vue-query'

const eventsCommonQueryKeys = [...commonQueryKeys, 'events']

export function useStudentEventsSummaryQuery (): UseQueryDefinedReturnType<EventOverviewDTO[], BaseApiException> {
  const queryKey = computed(() => [...eventsCommonQueryKeys, 'events'])
  return useQuery<EventOverviewDTO[], BaseApiException>({
    queryKey,
    initialData: [],
    queryFn: async (): Promise<EventOverviewDTO[]> => {
      return mockedEventsOverview
    }
  })
}
