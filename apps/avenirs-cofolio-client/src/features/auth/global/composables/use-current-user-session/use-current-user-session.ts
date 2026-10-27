import type { AcceptedCguDTO, EUniverse } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import { INVALID_UNIVERSE, INVALID_USER_CATEGORY, UNIVERSE_CGU, UNIVERSE_HOME, UNIVERSE_PRIORITY, UNIVERSE_USER_CATEGORY } from '@/features/auth/global/composables/use-current-user-session/use-current-user-session.constants'
import { useAuthStore } from '@/features/auth/global/stores/auth.store'

/**
 * Derives the current user's session from the auth store.
 *
 * Does not fetch API data or depend on i18n.
 */
export function useCurrentUserSession () {
  const authStore = useAuthStore()
  const { isLoggedIn, session, currentUniverse } = storeToRefs(authStore)

  if (import.meta.env?.DEV && !isLoggedIn.value) {
    throw new Error('useCurrentUserSession() called without an active session')
  }

  const roles = computed(() => session.value?.roles ?? [])
  const universes = computed(() =>
    [...(session.value?.universes ?? [])]
      .sort((a, b) => UNIVERSE_PRIORITY[a] - UNIVERSE_PRIORITY[b])
  )
  const categories = computed(() =>
    [...new Set(universes.value.map(universe => UNIVERSE_USER_CATEGORY[universe]))]
      .filter(category => Boolean(category))
  )

  const defaultUniverse = computed(() => universes.value?.[0] ?? INVALID_UNIVERSE)
  const activeUniverse = computed(() =>
    !!currentUniverse.value && universes.value.includes(currentUniverse.value)
      ? currentUniverse.value
      : defaultUniverse.value
  )
  const hasUniverse = computed(() => activeUniverse.value !== INVALID_UNIVERSE)
  const canSwitchUniverse = computed(() => universes.value.length > 1)

  const activeProfileCategory = computed(() =>
    hasUniverse.value
      ? UNIVERSE_USER_CATEGORY[activeUniverse.value]
      : INVALID_USER_CATEGORY
  )
  const hasProfileCategory = computed(() => activeProfileCategory.value !== INVALID_USER_CATEGORY)

  const homeRoute = computed(() =>
    hasUniverse.value
      ? UNIVERSE_HOME[activeUniverse.value]
      : ROUTES.AUTH.LOGIN
  )

  const acceptedCgu = computed(() => session.value?.acceptedCgu)
  const hasAcceptedLatestCgu = computed(() => acceptedCgu.value?.isLastVersion ?? false)
  const cguRoute = computed(() =>
    hasUniverse.value
      ? UNIVERSE_CGU[activeUniverse.value]
      : ROUTES.AUTH.CGU
  )

  /**
   * Switches the active universe if the user has access to it.
   *
   * @param universe The universe to switch to.
   */
  async function switchUniverse (universe: EUniverse) {
    if (universes.value.includes(universe)) {
      currentUniverse.value = universe
    }
  }

  /**
   * Updates the session with the user's CGU acceptance state.
   *
   * @param acceptedCgu Accepted CGU.
   */
  function setAcceptedCgu (acceptedCgu: AcceptedCguDTO) {
    authStore.patchSession({ acceptedCgu })
  }

  return {
    roles,
    universes: {
      available: universes,
      default: defaultUniverse,
      active: activeUniverse,
      hasActive: hasUniverse,
      canSwitch: canSwitchUniverse,
      switch: switchUniverse,
    },
    categories,
    profile: {
      activeCategory: activeProfileCategory,
      hasCategory: hasProfileCategory,
    },
    homeRoute,
    cgu: {
      accepted: acceptedCgu,
      hasAcceptedLatest: hasAcceptedLatestCgu,
      route: cguRoute,
      setAccepted: setAcceptedCgu
    }
  }
}
