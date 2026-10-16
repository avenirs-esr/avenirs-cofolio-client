import { useGetProfile } from '@/api/avenir-esr'
import { useBaseApiExceptionToast } from '@/common/composables'
import { useCurrentUserSession } from '@/features/auth/global/composables/use-current-user-session/use-current-user-session'
import { INVALID_PROFILE } from '@/features/auth/global/composables/use-current-user/use-current-user.constants'

/**
 * Exposes the current user's session state and the profile associated with
 * the active user category.
 *
 * Fetches the profile only when a valid category is available. Until the
 * API returns a profile, `profile` falls back to `INVALID_PROFILE`.
 */
export function useCurrentUser () {
  const session = useCurrentUserSession()

  const { data: profileData, isLoading: isProfileLoading, error: profileError } = useGetProfile(session.activeProfileCategory, {
    query: { enabled: session.hasProfileCategory }
  })
  useBaseApiExceptionToast(profileError)

  const profile = computed(() => profileData.value ?? INVALID_PROFILE)

  return {
    ...session,
    isProfileLoading,
    profile
  }
}
