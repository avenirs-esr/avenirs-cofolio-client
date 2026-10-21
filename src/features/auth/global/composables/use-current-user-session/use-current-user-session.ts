import type { AcceptedCguDTO, EUserCategory } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import { INVALID_USER_CATEGORY, ROLE_USER_CATEGORY, USER_CATEGORY_HOME, USER_CATEGORY_PRIORITY } from '@/features/auth/global/composables/use-current-user-session/use-current-user-session.constants'
import { useAuthStore } from '@/features/auth/global/stores/auth.store'

/**
 * Derives the current user's available categories, active category,
 * navigation target, and CGU acceptance state from the auth store.
 *
 * Does not fetch API data or depend on i18n.
 */
export function useCurrentUserSession () {
  const authStore = useAuthStore()
  const { isLoggedIn, session, selectedUserCategory } = storeToRefs(authStore)

  if (import.meta.env?.DEV && !isLoggedIn.value) {
    throw new Error('useCurrentUserSession() called without an active session')
  }

  const roles = computed(() => session.value?.roles ?? [])
  const categories = computed(() =>
    [...new Set(roles.value.map(role => ROLE_USER_CATEGORY[role]))]
      .sort((a, b) => USER_CATEGORY_PRIORITY[a] - USER_CATEGORY_PRIORITY[b])
      .filter(category => Boolean(category))
  )

  const defaultProfileCategory = computed(() => categories.value?.[0] ?? INVALID_USER_CATEGORY)
  const activeProfileCategory = computed(() =>
    !!selectedUserCategory.value && categories.value.includes(selectedUserCategory.value)
      ? selectedUserCategory.value
      : defaultProfileCategory.value
  )
  const hasProfileCategory = computed(() => activeProfileCategory.value !== INVALID_USER_CATEGORY)
  const canSwitchProfile = computed(() => categories.value.length > 1)

  const homeRoute = computed(() =>
    hasProfileCategory.value
      ? USER_CATEGORY_HOME[activeProfileCategory.value]
      : ROUTES.AUTH.LOGIN
  )

  const acceptedCgu = computed(() => session.value?.acceptedCgu)
  const hasAcceptedLatestCgu = computed(() => acceptedCgu.value?.isLastVersion ?? false)

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
    profile: {
      defaultCategory: defaultProfileCategory,
      activeCategory: activeProfileCategory,
      hasCategory: hasProfileCategory,
      canSwitch: canSwitchProfile,
      switch: switchProfile,
    },
    homeRoute,
    cgu: {
      accepted: acceptedCgu,
      hasAcceptedLatest: hasAcceptedLatestCgu,
      setAccepted: setAcceptedCgu
    }
  }
}
