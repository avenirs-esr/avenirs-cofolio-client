import type { BaseApiException } from '@/common/exceptions'
import type { PageOverviewDTO } from '@/types'
import { mockedPagesOverview } from '@/__mocks__/fixtures/student'
import { commonQueryKeys } from '@/features/student/global'
import { useQuery, type UseQueryDefinedReturnType } from '@tanstack/vue-query'

const studentPagesCommonQueryKeys = [...commonQueryKeys, 'pages']

export function useStudentPagesSummaryQuery (): UseQueryDefinedReturnType<PageOverviewDTO[], BaseApiException> {
  const queryKey = computed(() => [...studentPagesCommonQueryKeys, 'summary'])
  return useQuery<PageOverviewDTO[], BaseApiException>({
    queryKey,
    initialData: [],
    queryFn: async (): Promise<PageOverviewDTO[]> => {
      return mockedPagesOverview
    }
  })
}
