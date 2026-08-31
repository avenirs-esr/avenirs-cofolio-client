import type { BaseApiException } from '@/common/exceptions'
import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { getMe, type LoggedInUserDTO } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import router from '@/router'
import { useToasterStore } from '@/store'
import { useQueryClient } from '@tanstack/vue-query'
import { defineStore } from 'pinia'
import { readonly } from 'vue'

const DEFAULT_SESSION: LoggedInUserDTO = {
  firstname: '',
  lastname: '',
  roles: []
} as unknown as LoggedInUserDTO

export const useAuthStore = defineStore('auth', () => {
  const authenticated = ref<boolean>(false)
  const sessionReady = ref<boolean>(false)
  const session = ref<LoggedInUserDTO>(DEFAULT_SESSION)

  const redirecting = ref(false)
  const sessionPromise = ref<Promise<void> | null>(null)

  const { addErrorMessage } = useToasterStore()
  const queryClient = useQueryClient()

  async function loadSession () {
    if (sessionReady.value) {
      return
    }

    if (sessionPromise.value === null) {
      sessionPromise.value = (async () => {
        session.value = await getMe()
      })()
        .catch(error => addErrorMessage((error as BaseApiException).message))
        .finally(() => {
          sessionReady.value = !!session.value
          sessionPromise.value = null
        })
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
    session.value = {} as unknown as LoggedInUserDTO
  }

  const isLoggedIn = computed(() => authenticated.value && sessionReady.value)

  return {
    ensureAuthenticated,
    invalidateSession,
    isLoggedIn,
    session: readonly(session),
  }
}, {
  persist: {
    pick: [
      'authenticated',
      'sessionReady',
      'session',
    ]
  }
})
