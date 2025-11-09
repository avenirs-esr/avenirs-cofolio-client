import type { NavigationAccessDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import { useQuery, type UseQueryReturnType } from '@tanstack/vue-query'

const FIFTEEN_MINUTES = 15 * 60 * 1000

function useStudentNavigationAccessControlQuery (): UseQueryReturnType<NavigationAccessDTO, BaseApiException> {
  const queryKey = computed(() => ['student', 'navigation-access-control'])
  return useQuery<NavigationAccessDTO, BaseApiException>({
    queryKey,
    // TODO: call /me/navigation-access when the endpoint and client are ready
    queryFn: async (): Promise<NavigationAccessDTO> => {
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
