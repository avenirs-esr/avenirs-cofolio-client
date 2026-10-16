import { type AcceptedCguDTO, type EUserCategory, useGetProfile } from '@/api/avenir-esr'
import { useBaseApiExceptionToast } from '@/common/composables'
import { ROUTES } from '@/common/constants'
import { INVALID_PROFILE, INVALID_USER_CATEGORY, ROLE_USER_CATEGORY, USER_CATEGORY_HOME, USER_CATEGORY_PRIORITY } from '@/features/auth/global/composables/use-current-user/use-current-user.constants'
import { useAuthStore } from '@/features/auth/global/stores/auth.store'

/**
 * Stable entry point for the logged-in user.
 * To be used after login. Authentication checks and the session lifecycle stay in `useAuthStore`.
 */
export function useCurrentUser () {
  const authStore = useAuthStore()
  const { session, selectedUserCategory } = storeToRefs(authStore)

  const roles = computed(() => session.value?.roles ?? [])
  const categories = computed(() =>
    [...new Set(roles.value.map(role => ROLE_USER_CATEGORY[role]))]
      .sort((a, b) => USER_CATEGORY_PRIORITY[a] - USER_CATEGORY_PRIORITY[b])
  )

  const defaultProfileCategory = computed(() => categories.value?.[0] ?? INVALID_USER_CATEGORY)
  const activeProfileCategory = computed(() =>
    !!selectedUserCategory.value && categories.value.includes(selectedUserCategory.value)
      ? selectedUserCategory.value
      : defaultProfileCategory.value
  )

  const hasProfileCategory = computed(() => activeProfileCategory.value !== INVALID_USER_CATEGORY)
  const { data: profileData, isLoading: isProfileLoading, error: profileError } = useGetProfile(activeProfileCategory, {
    query: { enabled: hasProfileCategory }
  })
  useBaseApiExceptionToast(profileError)

  const profile = computed(() => profileData.value ?? INVALID_PROFILE)
  const canSwitchProfile = computed(() => categories.value.length > 1)

  const homeRoute = computed(() =>
    hasProfileCategory.value
      ? USER_CATEGORY_HOME[activeProfileCategory.value]
      : ROUTES.AUTH.LOGIN
  )

  const acceptedCgu = computed(() => session.value.acceptedCgu)
  const hasAcceptedLatestCgu = computed(() => !!acceptedCgu.value && acceptedCgu.value.isLastVersion)

  async function switchProfile (category: EUserCategory) {
    if (categories.value.includes(category)) {
      selectedUserCategory.value = category
    }
  }

  function setAcceptedCgu (acceptedCgu: AcceptedCguDTO) {
    authStore.patchSession({ acceptedCgu })
  }

  return {
    roles,
    categories,
    activeProfileCategory,
    isProfileLoading,
    profile,
    canSwitchProfile,
    switchProfile,
    homeRoute,
    acceptedCgu,
    hasAcceptedLatestCgu,
    setAcceptedCgu
  }
}
