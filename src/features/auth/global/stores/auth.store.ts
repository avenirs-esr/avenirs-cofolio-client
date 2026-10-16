import { getMe, type EUserCategory, type LoggedInUserDTO } from '@/api/avenir-esr'
import type { FetchOptions } from '@/api/fetch'
import type { BaseApiException } from '@/common/exceptions'
import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { ROUTES } from '@/common/constants'
import { HttpStatusCode } from '@/common/utils'
import { INVALID_SESSION } from '@/features/auth/global/stores/auth.store.constants'
import router from '@/router'
import { useToasterStore } from '@/store'
import { useQueryClient } from '@tanstack/vue-query'
import { defineStore } from 'pinia'

/**
 * Authentication state and session lifecycle: entry point for critical checks (router guard,
 * fetch interceptor). Everything derived from the session lives in `useCurrentUser`.
 */
export const useAuthStore = defineStore('auth', () => {
  const { addErrorMessage } = useToasterStore()
  const queryClient = useQueryClient()

  const authenticated = ref<boolean>(false)
  const sessionReady = ref<boolean>(false)
  const sessionPromise = ref<Promise<void>>()
  const session = ref<LoggedInUserDTO>()
  const redirecting = ref<boolean>(false)

  const selectedUserCategory = ref<EUserCategory>()

  async function loadSession () {
    if (sessionReady.value) {
      return
    }

    if (sessionPromise.value === undefined) {
      sessionPromise.value = (async () => {
        const fetchOptions: FetchOptions = { skipUnauthorizedHandling: true }

        let isStatusNot401 = true
        try {
          session.value = await getMe(fetchOptions)
        }
        catch (error) {
          const err = error as BaseApiException

          isStatusNot401 = err.status !== HttpStatusCode.UNAUTHORIZED
          if (isStatusNot401) {
            addErrorMessage(err.message)
          }
        }

        if (isStatusNot401) {
          sessionReady.value = true
        }
      })().finally(() => sessionPromise.value = undefined)
    }

    await sessionPromise.value
  }

  /**
   * Ensures the user is authenticated, triggering a redirect to the login page if not.
   *
   * Serves as the single entry point for authentication checks across two contexts:
   * - **Router guard** (`delegated: true`): returns the login route instead of navigating directly, allowing `router.beforeEach` to delegate the redirect Vue Router.
   * - **Fetch interceptor** (`force: true`): bypasses session loading and redirects immediately. Used when a 401 is received mid-session.
   *
   * A `redirecting` flag prevents concurrent redirects (e.g. multiple simultaneous 401 responses). Note that this flag is not persisted and resets on page reload.
   *
   * @param options Options
   * @param options.to Current route, used to preserve the intended destination as a redirect query param
   * @param options.delegated If true, returns the login route instead of navigating directly
   * @param options.force If true, bypasses session loading and redirects unconditionally
   * @returns The login route if `delegated` is true and the user is not authenticated, `undefined` otherwise
   */
  async function ensureAuthenticated (options: {
    to?: RouteLocationNormalized
    delegated?: boolean
    force?: boolean
  } = {}): Promise<RouteLocationRaw | undefined> {
    if (redirecting.value) {
      return
    }

    if (!options.force) {
      await loadSession()
      if (sessionReady.value) {
        authenticated.value = true // TODO: to be updated by a source of truth other than the session load
        return
      }
    }

    redirecting.value = true
    invalidateSession()

    await queryClient.cancelQueries()

    const toLogin = {
      name: ROUTES.AUTH.LOGIN.name,
      query: { redirect: options.to?.fullPath ?? router.currentRoute.value.fullPath },
    }

    if (options.delegated) {
      return toLogin
    }

    await router.replace(toLogin)
  }

  function patchSession (patch: Partial<LoggedInUserDTO>) {
    if (session.value) {
      session.value = {
        ...session.value,
        ...patch
      }
    }
  }

  function invalidateSession () {
    authenticated.value = false
    sessionReady.value = false
    session.value = undefined
    selectedUserCategory.value = undefined
    queryClient.clear()
  }

  return {
    ensureAuthenticated,
    isLoggedIn: computed(() => authenticated.value && sessionReady.value),
    session: computed(() => session.value ?? INVALID_SESSION),
    patchSession,
    invalidateSession,
    selectedUserCategory,
  }
}, {
  persist: {
    pick: [
      'authenticated',
      'sessionReady',
      'session',
      'selectedUserCategory'
    ]
  }
})
