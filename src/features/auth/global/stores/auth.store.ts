import type { FetchOptions } from '@/api/fetch'
import type { BaseApiException } from '@/common/exceptions'
import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { EUserCategory, getProfile, type ProfileOverviewDTO } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import { HttpStatusCode } from '@/common/utils'
import router from '@/router'
import { useToasterStore } from '@/store'
import { useQueryClient } from '@tanstack/vue-query'
import { defineStore } from 'pinia'
import { readonly } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const authenticated = ref<boolean>(false)
  const sessionReady = ref<boolean>(false)
  const profile = ref<ProfileOverviewDTO | null>(null)

  const redirecting = ref(false)
  const sessionPromise = ref<Promise<void> | null>(null)

  const { addErrorMessage } = useToasterStore()
  const queryClient = useQueryClient()

  const isLoggedIn = computed(() => authenticated.value && sessionReady.value)

  /**
   * Loads the current user session by attempting to retrieve the user's profile.
   *
   * Acts as the single entry point for session initialization and prevents duplicate requests through the use of a shared promise. If a session has already been resolved, subsequent calls return immediately.
   *
   * Non-authentication errors are surfaced to the user through the toaster, while authentication failures are silently ignored and treated as an unauthenticated session.
   */
  async function loadSession () {
    if (sessionReady.value) {
      return
    }

    if (sessionPromise.value === null) {
      sessionPromise.value = (async () => {
        const fetchOptions: FetchOptions = { skipUnauthorizedHandling: true }

        // TODO: Add a dedicated endpoint to retrieve the user profile regardless of their "role"
        let isStatusNot401 = true
        try {
          try {
            profile.value = await getProfile(EUserCategory.STUDENT, fetchOptions)
          }
          catch (error) {
            const err = error as BaseApiException

            if (err.status === HttpStatusCode.UNAUTHORIZED) {
              throw err
            }

            profile.value = await getProfile(EUserCategory.STAFF, fetchOptions)
          }
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
      })().finally(() => sessionPromise.value = null)
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

  function invalidateSession () {
    authenticated.value = false
    sessionReady.value = false
    profile.value = null
  }

  return {
    ensureAuthenticated,
    invalidateSession,
    isLoggedIn,
    profile: readonly(profile)
  }
}, {
  persist: {
    pick: [
      'authenticated',
      'sessionReady',
      'profile',
    ]
  }
})
