import type { DeepReadonly } from 'vue'
import type { LocationQueryValueRaw, RouteLocationRaw } from 'vue-router'
import type { EUniverse, LoggedInUserDTO } from '@/api/avenir-esr'
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

function readPrefs (storage: Storage): { currentUniverse?: EUniverse } | undefined {
  try {
    const stored = storage.getItem(AUTH_PREFS_KEY)
    return stored ? (JSON.parse(stored) as { currentUniverse?: EUniverse } | null) ?? undefined : undefined
  }
  catch {
    return undefined
  }
}

function writePrefs (storage: Storage, universe: EUniverse | undefined) {
  try {
    storage.setItem(AUTH_PREFS_KEY, JSON.stringify({ currentUniverse: universe }))
  }
  catch {
    // The storage is unavailable or full.
  }
}

/**
 * Manages authentication state and session lifecycle.
 *
 * This store is the entry point for authentication checks initiated by the router guard
 * and the fetch interceptor.
 *
 * A session restored from storage may be stale because the user's roles have changed.
 * On the first guarded navigation, `/me` is requested to revalidate the restored session.
 * If the request fails for a reason other than 401, the existing session is preserved.
 * Afterwards, the session is trusted until a protected request returns 401.
 *
 * Following a 401 from a protected request, `/me` is called to confirm whether the session
 * is still valid:
 * - `SessionCheck.VALID`: the session is refreshed and the original request can be replayed.
 * - `SessionCheck.UNAUTHORIZED`: the session is invalidated and the user is redirected to
 *   login.
 * - `SessionCheck.ERROR`: the error is displayed and the existing session, if any, is
 *   preserved.
 *
 * The selected universe is stored separately for each tab in `sessionStorage` while
 * `localStorage` retains the last selected universe for newly opened tabs.
 */
export const useAuthStore = defineStore('auth', () => {
  const { addErrorMessage } = useToasterStore()
  const queryClient = useQueryClient()

  const session = ref<LoggedInUserDTO>()
  const currentUniverse = ref<EUniverse | undefined>((readPrefs(sessionStorage) ?? readPrefs(localStorage))?.currentUniverse)
  const isLoggedIn = computed(() => !!session.value)

  let revalidation: Promise<SessionCheck> | undefined
  let sessionChecked = false
  let redirecting = false
  let redirectOnShow = false

  // Initialize this tab's stored preference from the restored value.
  writePrefs(sessionStorage, currentUniverse.value)

  /**
   * Revalidates the current session by requesting `/me`.
   *
   * Every invocation requests `/me`, leaving the decision about when to call this function
   * to the caller. Concurrent invocations share the same in-flight request.
   *
   * @returns A promise resolving to:
   * - `SessionCheck.VALID` if the server confirms the session and returns the current user.
   * - `SessionCheck.UNAUTHORIZED` if the server responds with 401.
   * - `SessionCheck.ERROR` if the request fails for another reason. The error is displayed, and
   *   the existing session, if any, is preserved.
   */
  function revalidateSession (): Promise<SessionCheck> {
    const fetchOptions: FetchOptions = { skipUnauthorizedHandling: true }

    revalidation ??= (async (): Promise<SessionCheck> => {
      try {
        session.value = await getMe(fetchOptions)

        // A valid session cancels any redirect to login that was previously in progress.
        redirecting = false

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
    })().finally(() => {
      revalidation = undefined
      sessionChecked = true
    })

    return revalidation
  }

  /**
   * Ensures that a valid session is available before a protected navigation proceeds.
   *
   * A session that has already been checked during this page load is trusted; Otherwise, the
   * session is revalidated through `/me`.
   *
   * @param to The intended destination, passed to the login route as its `redirect` query
   * parameter.
   * @returns `undefined` if the navigation may proceed, the login route if the session is
   * unauthorized, or `false` if navigation must be aborted because the check failed without an
   * existing session or another redirect is already in progress.
   */
  async function ensureSession (to: LocationQueryValueRaw): Promise<RouteLocationRaw | false | undefined> {
    if (session.value && sessionChecked) {
      return undefined
    }

    if (!session.value) {
      // A new authentication attempt can proceed after an earlier redirect to login.
      redirecting = false
    }

    const hadSession = !!session.value

    switch (await revalidateSession()) {
      case SessionCheck.UNAUTHORIZED:
        return redirectToLogin(to) ?? false
      case SessionCheck.ERROR:
        return hadSession ? undefined : false
    }

    return undefined
  }

  /**
   * Invalidates the current session and clears state associated with it.
   *
   * The shared universe preference is cleared even if this tab has no universe selected.
   * This prevents a newly opened tab, potentially belonging to another user, from restoring a
   * preference left by the previous session.
   */
  function invalidateSession () {
    session.value = undefined
    currentUniverse.value = undefined
    writePrefs(localStorage, undefined)
    queryClient.clear()
  }

  /**
   * Invalidates the current session and creates a login redirect.
   *
   * Only one redirect is created at a time, preventing concurrent 401 responses from
   * triggering duplicate redirects.
   *
   * @param to The destination to return to after login, passed as the `redirect` query
   * parameter.
   * @returns The login route, or `undefined` if a redirect is already in progress.
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
   * Applies a partial update to the current session.
   *
   * @param patch The session properties to update.
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
   * Handles a session invalidation received from another tab.
   *
   * If the current page is public, the local session is invalidated without navigation;
   * Otherwise, the user is redirected to login.
   *
   * @returns A promise that resolves when any required navigation has completed.
   */
  async function applyDroppedSession () {
    const { default: router } = await import('@/router')
    const route = router.currentRoute.value

    if (!route.meta.restrictions) {
      invalidateSession()
      return
    }

    const toLogin = redirectToLogin(route.fullPath)
    if (toLogin !== undefined) {
      await router.replace(toLogin)
    }
  }

  /**
   * Synchronizes this tab's session with changes made by other tabs.
   *
   * The `storage` event is used to detect changes to the persisted session. A session received
   * from another tab is adopted as is. A removed session causes this tab to invalidate its
   * local state and redirect to login if necessary.
   *
   * When the tab is hidden, the redirect is deferred until it becomes visible again.
   *
   * @param event The browser storage event.
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
   * Completes a deferred login redirect when the tab becomes visible again.
   *
   * If a session has been restored or revalidated in the meantime, the redirect is cancelled
   * and the current page is left unchanged.
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

  // The Pinia persistence plugin "only" persists `session`. These writes keep the current
  // tab's choice in `sessionStorage` and the last selected choice in `localStorage` for newly
  // opened tabs.
  watch(currentUniverse, (universe) => {
    writePrefs(sessionStorage, universe)
    writePrefs(localStorage, universe)
  })

  return {
    ensureSession,
    revalidateSession,
    redirectToLogin,
    isLoggedIn,
    // A runtime readonly() would break the restoration of the persisted state.
    session: session as DeepReadonly<typeof session>,
    patchSession,
    invalidateSession,
    currentUniverse
  }
}, {
  persist: [
    { key: AUTH_SESSION_KEY, pick: ['session'] }
  ]
})
