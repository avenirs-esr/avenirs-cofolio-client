import type { BaseApiException } from '@/common/exceptions'
import type { TraceConfigInfoDTO } from '@/types'
import { mockedTracesConfiguration } from '@/features/student/queries/fixtures'
import { useQuery, type UseQueryReturnType } from '@tanstack/vue-query'

const commonQueryKeys = ['user', 'student']

export function useStudentTracesConfigurationQuery (): UseQueryReturnType<TraceConfigInfoDTO, BaseApiException> {
  const queryKey = computed(() => [...commonQueryKeys, 'traces', 'config'])
  return useQuery<TraceConfigInfoDTO, BaseApiException>({
    queryKey,
    // TODO: call /traces/config when the endpoint and client are ready
    queryFn: async (): Promise<TraceConfigInfoDTO> => {
      return mockedTracesConfiguration
    }
  })
}
