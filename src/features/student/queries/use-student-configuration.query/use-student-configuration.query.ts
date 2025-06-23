import type { TraceConfigurationInfo } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import { mockedTracesConfiguration } from '@/features/student/queries/fixtures'
import { useQuery, type UseQueryReturnType } from '@tanstack/vue-query'

const commonQueryKeys = ['user', 'student']

export function useStudentTracesConfigurationQuery (): UseQueryReturnType<TraceConfigurationInfo, BaseApiException> {
  const queryKey = computed(() => [...commonQueryKeys, 'traces', 'config'])
  return useQuery<TraceConfigurationInfo, BaseApiException>({
    queryKey,
    // TODO: call /traces/config when the endpoint and client are ready
    queryFn: async (): Promise<TraceConfigurationInfo> => {
      /*
      // TODO: Uncomment when the API is ready
      const response = await getTraceConfigInfo()
      */
      return mockedTracesConfiguration
    }
  })
}
