import type { BaseApiException } from '@/common/exceptions'
import type { ProgramProgressViewDTO_Temp } from '@/types'
import { mockedPrograms } from '@/features/student/queries/utils'
import { useQuery, type UseQueryReturnType } from '@tanstack/vue-query'

const commonQueryKeys = ['user', 'student']

export function useProgramProgressViewQuery (): UseQueryReturnType<ProgramProgressViewDTO_Temp, BaseApiException> {
  const queryKey = computed(() => [...commonQueryKeys, 'programProgress'])
  return useQuery<ProgramProgressViewDTO_Temp, BaseApiException>({
    queryKey,
    // TODO: call /program-progress/view when the endpoint and client are ready
    queryFn: async (): Promise<ProgramProgressViewDTO_Temp> => {
      return mockedPrograms
    }
  })
}
