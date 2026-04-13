import type { BaseApiException } from '@/common/exceptions'
import { type EUserCategory, getProfile, type ProfileOverviewDTO } from '@/api/avenir-esr'
import { useQuery, type UseQueryReturnType } from '@tanstack/vue-query'

export const getUserSummaryQueryKeys = (category: EUserCategory) => ['user', category, 'summary']

export function useUserSummaryQuery (category: EUserCategory): UseQueryReturnType<ProfileOverviewDTO, BaseApiException> {
  return useQuery<ProfileOverviewDTO, BaseApiException>({
    queryKey: getUserSummaryQueryKeys(category),
    queryFn: async (): Promise<ProfileOverviewDTO> => {
      return getProfile(category)
    }
  })
}
