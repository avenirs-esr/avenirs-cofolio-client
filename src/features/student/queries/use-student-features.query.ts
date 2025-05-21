import type { BaseApiException } from '@/common/exceptions/base-api.exception'
import { StudentFeatures } from '@/types'
import { useQuery, type UseQueryReturnType } from '@tanstack/vue-query'

function useStudentFeaturesQuery (): UseQueryReturnType<StudentFeatures[], BaseApiException> {
  const queryKey = computed(() => ['cofolio', 'features'])
  return useQuery<StudentFeatures[], BaseApiException>({
    queryKey,
    // TODO: call /feature-flipping/student when the endpoint and client are ready
    queryFn: async (): Promise<StudentFeatures[]> => {
      return [
        StudentFeatures.APC,
        StudentFeatures.LIFE_PROJECT,
      ]
    }
  })
}

export { useStudentFeaturesQuery }
