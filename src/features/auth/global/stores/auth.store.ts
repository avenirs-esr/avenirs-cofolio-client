import type { DeepReadonly } from 'vue'
import type { LocationQueryValueRaw, RouteLocationRaw } from 'vue-router'
import type { EUserCategory, LoggedInUserDTO } from '@/api/avenir-esr'
import type { FetchOptions } from '@/api/fetch'
import type { BaseApiException } from '@/common/exceptions'
import { useQueryClient } from '@tanstack/vue-query'
import { defineStore } from 'pinia'
import { onScopeDispose } from 'vue'
import { getMe } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import { HttpStatusCode } from '@/common/utils'
import { AUTH_PREFS_KEY, AUTH_SESSION_KEY } from '@/features/auth/global/stores/auth.store.constants'
import { SessionCheck } from '@/features/auth/global/stores/auth.store.types'
import { useToasterStore } from '@/store'

/**
 * Authentication state and session lifecycle: entry point for critical checks (router guard,
 * fetch interceptor).
 *
 * A session already in memory, or restored from the storage, is trusted until a protected request
 * answers 401. `/me` is then called to confirm before deciding whether the user must log in again:
 * - valid: the session is refreshed and the request is replayed.
 * - unauthorized: the session is invalidated and the user is redirected to login.
 * - any other failure: the error is displayed and the current session is kept.
 */
export const useAuthStore = defineStore('auth', () => {
  const { addErrorMessage } = useToasterStore()
  const queryClient = useQueryClient()

  const session = ref<LoggedInUserDTO>()
  const selectedUserCategory = ref<EUserCategory>()

  const isLoggedIn = computed(() => !!session.value)

  let revalidation: Promise<SessionCheck> | undefined
  let redirecting = false
  let redirectOnShow = false

  /**
   * Establish or confirm the session.
   *
   * Always performs the `/me` request: it is up to the caller to decide whether it is needed, i.e. only
   * when there is no session (router guard) or after a protected request answered 401 (fetch
   * interceptor). Concurrent callers share the same request.
   *
   * - `SessionCheck.VALID`: the fresh session is stored.
   * - `SessionCheck.UNAUTHORIZED`: the server confirms that the user is not authenticated.
   * - `SessionCheck.ERROR`: any other failure (network, 5xx, etc.). The error is displayed and the
   *   current session, if any, is kept.
   */
  function revalidateSession (): Promise<SessionCheck> {
    const fetchOptions: FetchOptions = { skipUnauthorizedHandling: true }

    revalidation ??= (async (): Promise<SessionCheck> => {
      try {
        session.value = await getMe(fetchOptions)
        redirecting = false // A session is back: any earlier redirect to login is over

        return SessionCheck.VALID
      }
      catch (error) {
        const { status, message } = error as BaseApiException

        if (status === HttpStatusCode.UNAUTHORIZED) {
          return SessionCheck.UNAUTHORIZED
        }

        addErrorMessage(message)
        return SessionCheck.ERROR
      }
    })().finally(() => revalidation = undefined)

    return revalidation
  }

  /**
   * Router guard entry point: ensures that a session exists before the navigation goes on.
   *
   * A session already in memory, or restored from the storage, is trusted without any request.
   *
   * @param to Location the user is heading to (passed as the `redirect` query parameter of the login route).
   * @returns `undefined` when a session exists, the login route when the user is not authenticated,
   * or `false` to abort the navigation (the error has been displayed, or a redirect to login was
   * triggered concurrently).
   */
  async function ensureSession (to: LocationQueryValueRaw): Promise<RouteLocationRaw | false | undefined> {
    if (session.value) {
      return undefined
    }

    // New attempt without a session: any earlier redirect to login is over
    redirecting = false

    switch (await revalidateSession()) {
      case SessionCheck.UNAUTHORIZED:
        return redirectToLogin(to) ?? false
      case SessionCheck.ERROR:
        return false
    }

    return undefined
  }

  /**
   * Invalidates the session and the state scoped to it.
   */
  function invalidateSession () {
    session.value = undefined
    selectedUserCategory.value = undefined
    queryClient.clear()
  }

  /**
   * Invalidates the session and returns the login route. The caller navigates.
   *
   * Returns `undefined` when a redirect is already in progress, so that a burst of 401 responses
   * redirects only once.
   *
   * @param to Location to come back to after login (passed as the `redirect` query parameter).
   */
  function redirectToLogin (to: LocationQueryValueRaw): RouteLocationRaw | undefined {
    if (redirecting) {
      return undefined
    }

    redirecting = true
    invalidateSession()

    return {
      name: ROUTES.AUTH.LOGIN.name,
      query: { redirect: to }
    }
  }

  /**
   * Patch the current session.
   *
   * @param patch Patch to apply to the current session.
   */
  function patchSession (patch: Partial<LoggedInUserDTO>) {
    if (session.value) {
      session.value = {
        ...session.value,
        ...patch
      }
    }
  }

  /**
   * Applies in this tab a session dropped by another tab (logout, or 401 confirmed).
   *
   * Resets the state as a 401 received here would, then sends the user to login, unless the
   * current page is public: it does not require a session, so it stays displayed.
   */
  async function applyDroppedSession () {
    const { default: router } = await import('@/router')
    const route = router.currentRoute.value

    if (route.meta.public === true) {
      invalidateSession()
      return
    }

    const toLogin = redirectToLogin(route.fullPath)
    if (toLogin !== undefined) {
      await router.replace(toLogin)
    }
  }

  /**
   * Keeps the session identical in every tab of the browser: `localStorage` is shared by the tabs
   * and the `storage` event notifies the writes of the other ones.
   *
   * The persistence plugin only reads the storage when the store is created, and a tab never
   * receives the events of its own writes. Only the session entry matters here: the selected user
   * category is deliberately not synced, each tab keeps its own profile.
   *
   * For a session entry written by another tab:
   * - with a session (login, revalidation, patch): it is adopted as is, without calling `/me`,
   *   and a redirect to login waiting for this tab to be displayed is cancelled;
   * - without a session (logout, 401 confirmed by `/me`, entry removed or storage cleared): the
   *   state is reset here too, right away. The user is sent to login at once if the tab is
   *   displayed, when it is displayed again otherwise.
   */
  function onStorageChange (event: StorageEvent) {
    if (event.storageArea !== localStorage || (event.key !== null && event.key !== AUTH_SESSION_KEY)) {
      return
    }

    let incoming: LoggedInUserDTO | undefined

    try {
      incoming = event.newValue
        ? (JSON.parse(event.newValue) as { session?: LoggedInUserDTO }).session
        : undefined
    }
    catch {
      return
    }

    if (incoming) {
      session.value = incoming
      redirecting = false
      redirectOnShow = false
    }
    else if (session.value) {
      if (document.visibilityState === 'visible') {
        void applyDroppedSession()
      }
      else {
        invalidateSession()
        redirectOnShow = true
      }
    }
  }

  /**
   * Completes, when the tab is displayed again, a session dropped by another tab while it was hidden.
   *
   * The user is sent to login only if no session is back in the meantime (they logged in again
   * elsewhere, or a request of this tab revalidated it): the current page then stays as is.
   */
  function onVisibilityChange () {
    if (document.visibilityState !== 'visible' || !redirectOnShow) {
      return
    }

    redirectOnShow = false

    if (!session.value) {
      void applyDroppedSession()
    }
  }

  window.addEventListener('storage', onStorageChange)
  document.addEventListener('visibilitychange', onVisibilityChange)

  onScopeDispose(() => {
    window.removeEventListener('storage', onStorageChange)
    document.removeEventListener('visibilitychange', onVisibilityChange)
  })

  return {
    ensureSession,
    revalidateSession,
    redirectToLogin,
    isLoggedIn,
    session: session as DeepReadonly<typeof session>, // A runtime readonly() would break the restoration of the persisted state
    patchSession,
    invalidateSession,
    selectedUserCategory
  }
}, {
  persist: [
    { key: AUTH_SESSION_KEY, pick: ['session'] },
    { key: AUTH_PREFS_KEY, pick: ['selectedUserCategory'] }
  ]
})
