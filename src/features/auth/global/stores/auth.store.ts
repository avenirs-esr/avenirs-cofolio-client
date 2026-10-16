import type { LocationQueryValueRaw, RouteLocationRaw } from 'vue-router'
import type { EUserCategory, LoggedInUserDTO } from '@/api/avenir-esr'
import type { FetchOptions } from '@/api/fetch'
import type { BaseApiException } from '@/common/exceptions'
import { useQueryClient } from '@tanstack/vue-query'
import { defineStore } from 'pinia'
import { readonly } from 'vue'
import { getMe } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import { HttpStatusCode } from '@/common/utils'
import { INVALID_SESSION } from '@/features/auth/global/stores/auth.store.constants'
import { useToasterStore } from '@/store'

/**
 * Authentication state and session lifecycle: entry point for critical checks (router guard,
 * fetch interceptor).
 */
export const useAuthStore = defineStore('auth', () => {
  const { addErrorMessage } = useToasterStore()
  const queryClient = useQueryClient()

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
   * Ensures the user is authenticated.
   *
   * Before returning the login route, the session is invalidated and the query cache cleared.
   *
   * @param to Location to come back to after login (becomes the `redirect` query param)
   * @param force If true, skips session loading and redirects unconditionally
   * @returns The login route if a redirect is needed; `undefined` if the user is authenticated or if a
   * redirect is already in progress
   */
  async function ensureAuthenticated (to: LocationQueryValueRaw, force: boolean = false): Promise<RouteLocationRaw | undefined> {
    if (redirecting.value) {
      return undefined
    }

    if (!force) {
      if (sessionReady.value) {
        return undefined
      }

      await loadSession()

      if (sessionReady.value) {
        return undefined
      }
    }

    redirecting.value = true
    invalidateSession()
    await queryClient.cancelQueries()

    return {
      name: ROUTES.AUTH.LOGIN.name,
      query: { redirect: to },
    }
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
    sessionReady.value = false
    session.value = undefined
    selectedUserCategory.value = undefined
    queryClient.clear()
  }

  return {
    ensureAuthenticated,
    isLoggedIn: readonly(sessionReady),
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
