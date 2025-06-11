import type { BaseApiException } from '@/common/exceptions'
import type { ProgramProgressViewDTO } from '@/types'
import { mockedPrograms } from '@/features/student/queries/fixtures'
import { useQuery, type UseQueryReturnType } from '@tanstack/vue-query'

const commonQueryKeys = ['user', 'student']

export function useProgramProgressViewQuery (): UseQueryReturnType<ProgramProgressViewDTO[], BaseApiException> {
  const queryKey = computed(() => [...commonQueryKeys, 'programProgress'])
  return useQuery<ProgramProgressViewDTO[], BaseApiException>({
    queryKey,
    // TODO: call /program-progress/view when the endpoint and client are ready
    queryFn: async (): Promise<ProgramProgressViewDTO[]> => {
      return mockedPrograms
    }
  })
}
