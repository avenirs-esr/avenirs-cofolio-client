import type { BaseApiException } from '@/common/exceptions'
import type { StudentNavigationAccessControlDTO } from '@/types'
import { useQuery, type UseQueryReturnType } from '@tanstack/vue-query'

const FIFTEEN_MINUTES = 15 * 60 * 1000

function useStudentNavigationAccessControlQuery (): UseQueryReturnType<StudentNavigationAccessControlDTO, BaseApiException> {
  const queryKey = computed(() => ['student', 'navigation-access-control'])
  return useQuery<StudentNavigationAccessControlDTO, BaseApiException>({
    queryKey,
    // TODO: call /me/navigation-access when the endpoint and client are ready
    queryFn: async (): Promise<StudentNavigationAccessControlDTO> => {
      return {
        APC: {
          enabledByInstitution: true,
          hasProgram: true
        },
        LIFE_PROJECT: {
          enabledByInstitution: true,
        },
      }
    },
    staleTime: FIFTEEN_MINUTES,
  })
}

export { useStudentNavigationAccessControlQuery }
