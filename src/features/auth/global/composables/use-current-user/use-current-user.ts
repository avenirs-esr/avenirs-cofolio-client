import { useGetProfile } from '@/api/avenir-esr'
import { useBaseApiExceptionToast } from '@/common/composables'
import { useCurrentUserSession } from '@/features/auth/global/composables/use-current-user-session/use-current-user-session'
import { INVALID_PROFILE, PROFILE_GC_TIME, PROFILE_STALE_TIME } from '@/features/auth/global/composables/use-current-user/use-current-user.constants'

/**
 * Exposes the current user's session state and the profile associated with
 * the active user category.
 *
 * Fetches the profile only when a valid category is available. Until the
 * API returns a profile, `profile` falls back to `INVALID_PROFILE`.
 */
export function useCurrentUser () {
  const user = useCurrentUserSession()

  const { data: _profileData, isLoading: isProfileLoading, error: profileError, } = useGetProfile(user.profile.activeCategory, {
    query: {
      enabled: user.profile.hasCategory,
      staleTime: PROFILE_STALE_TIME,
      gcTime: PROFILE_GC_TIME
    }
  })
  useBaseApiExceptionToast(profileError)

  const profileData = computed(() => _profileData.value ?? INVALID_PROFILE)

  return {
    ...user,
    profile: {
      ...user.profile,
      isLoading: isProfileLoading,
      data: profileData
    }
  }
}
