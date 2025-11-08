import type { BaseApiException } from '@/common/exceptions'
import type { ResumeOverviewDTO } from '@/types'
import { mockedResumesOverview } from '@/__mocks__/fixtures/student'
import { commonQueryKeys } from '@/features/student/global'
import { useQuery, type UseQueryDefinedReturnType } from '@tanstack/vue-query'

const studentResumesCommonQueryKeys = [...commonQueryKeys, 'resumes']

export function useStudentResumesSummaryQuery (): UseQueryDefinedReturnType<ResumeOverviewDTO[], BaseApiException> {
  const queryKey = computed(() => [...studentResumesCommonQueryKeys, 'summary'])
  return useQuery<ResumeOverviewDTO[], BaseApiException>({
    queryKey,
    initialData: [],
    queryFn: async (): Promise<ResumeOverviewDTO[]> => {
      return mockedResumesOverview
    }
  })
}
