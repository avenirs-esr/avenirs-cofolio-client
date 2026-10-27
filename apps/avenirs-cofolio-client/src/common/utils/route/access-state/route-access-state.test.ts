import type { App } from 'vue'
import type { LoggedInUserDTO } from '@/api/avenir-esr'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { flushPromises } from '@vue/test-utils'
import { createApp } from 'vue'
import { ERole, EUniverse } from '@/api/avenir-esr'
import { fetchAuthorizationQuery, invalidateRouteAccess, routeAccessVersion, sessionRights } from '@/common/utils/route/access-state/route-access-state'

const ADMIN = {
  roles: [ERole.ROLE_ADMIN, ERole.ROLE_GROUP_MANAGER],
  universes: [EUniverse.STAFF, EUniverse.STUDENT]
}

const mockSession = ref<Pick<LoggedInUserDTO, 'roles' | 'universes'>>()

vi.mock('@/features/auth/global/stores/auth.store', () => ({
  useAuthStore: () => ({
    get session () {
      return mockSession.value
    }
  })
}))

BddTest().given('the session rights', () => {
  BddTest().when('there is a session', () => {
    BddTest().then('it should give the same value for the same rights in another order', () => {
      mockSession.value = ADMIN
      const previousRights = sessionRights()

      mockSession.value = {
        roles: [...ADMIN.roles].reverse(),
        universes: [...ADMIN.universes].reverse()
      }

      expect(sessionRights()).toBe(previousRights)
    })

    BddTest().then('it should give another value for other rights', () => {
      mockSession.value = ADMIN
      const previousRights = sessionRights()

      mockSession.value = {
        ...ADMIN,
        roles: [ERole.ROLE_ADMIN]
      }

      expect(sessionRights()).not.toBe(previousRights)
    })
  })

  BddTest().when('there is no session', () => {
    BddTest().then('it should give an empty string', () => {
      mockSession.value = undefined

      expect(sessionRights()).toBe('')
    })
  })
})

BddTest().given('invalidateRouteAccess', () => {
  BddTest().when('it is called', () => {
    BddTest().then('it should change the version, which the effects reading it follow', async () => {
      const versions: number[] = []
      const stop = watchEffect(() => {
        versions.push(routeAccessVersion())
      })

      invalidateRouteAccess()
      await flushPromises()
      stop()

      expect(versions).toHaveLength(2)
      expect(versions[1]).not.toBe(versions[0])
    })
  })
})

BddTest().given('fetchAuthorizationQuery', () => {
  const QUERY_KEY = ['group-user', 'group-id', 'user-id']
  const OTHER_QUERY_KEY = ['activities']
  const queryFn = vi.fn()

  let app: App
  let queryClient: QueryClient

  // As an authorization callback, run in the app context
  const fetchForCheck = (staleTime = 0) => app.runWithContext(() => fetchAuthorizationQuery({
    queryKey: QUERY_KEY,
    queryFn,
    staleTime
  }))

  beforeEach(() => {
    mockSession.value = ADMIN
    queryFn.mockReset().mockResolvedValue({ canManage: true })
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    app = createApp({ render: () => null })
    app.use(VueQueryPlugin, { queryClient })
  })

  BddTest().when('a callback reads a query through it', () => {
    BddTest().then('it should give the query data, kept in the cache the page shares', async () => {
      await expect(fetchForCheck()).resolves.toEqual({ canManage: true })
      expect(queryClient.getQueryData(QUERY_KEY)).toEqual({ canManage: true })
    })

    BddTest().then('it should not fetch it again while it is fresh', async () => {
      await fetchForCheck(Infinity)
      await fetchForCheck(Infinity)

      expect(queryFn).toHaveBeenCalledTimes(1)
    })

    BddTest().then('it should reject with the query error', async () => {
      const error = new Error('Network Error')
      queryFn.mockRejectedValue(error)

      await expect(fetchForCheck()).rejects.toBe(error)
    })
  })

  BddTest().when('the query is invalidated', () => {
    BddTest().then('it should change the version, so that the access is checked again', async () => {
      await fetchForCheck(Infinity)
      const version = routeAccessVersion()

      await queryClient.invalidateQueries({ queryKey: QUERY_KEY })

      expect(routeAccessVersion()).not.toBe(version)
    })

    BddTest().then('it should fetch it again at the next check', async () => {
      await fetchForCheck(Infinity)
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      await fetchForCheck(Infinity)

      expect(queryFn).toHaveBeenCalledTimes(2)
    })
  })

  BddTest().when('a query that no callback reads is invalidated', () => {
    BddTest().then('it should not change the version', async () => {
      await fetchForCheck()
      queryClient.setQueryData(OTHER_QUERY_KEY, [])
      const version = routeAccessVersion()

      await queryClient.invalidateQueries({ queryKey: OTHER_QUERY_KEY })

      expect(routeAccessVersion()).toBe(version)
    })
  })

  BddTest().when('the session rights change', () => {
    BddTest().then('it should invalidate the query, its answer being given under other rights, and change the version', async () => {
      await fetchForCheck(Infinity)
      const version = routeAccessVersion()

      mockSession.value = {
        ...ADMIN,
        roles: [ERole.ROLE_ADMIN]
      }

      expect(queryClient.getQueryState(QUERY_KEY)?.isInvalidated).toBe(true)
      expect(routeAccessVersion()).not.toBe(version)
    })

    BddTest().then('it should not invalidate it when the same rights come again', async () => {
      await fetchForCheck(Infinity)

      mockSession.value = {
        roles: [...ADMIN.roles].reverse(),
        universes: ADMIN.universes
      }

      expect(queryClient.getQueryState(QUERY_KEY)?.isInvalidated).toBe(false)
    })
  })

  BddTest().when('the session disappears, then appears', () => {
    BddTest().then('it should leave the query to the auth store, which clears the cache at logout', async () => {
      await fetchForCheck(Infinity)

      mockSession.value = undefined
      mockSession.value = ADMIN

      expect(queryClient.getQueryState(QUERY_KEY)?.isInvalidated).toBe(false)
    })
  })

  BddTest().when('it is called outside of the app context, after the first await of a callback for instance', () => {
    BddTest().then('it should throw, as useQueryClient() does', () => {
      expect(() => fetchAuthorizationQuery({
        queryKey: QUERY_KEY,
        queryFn
      })).toThrow()
    })
  })
})
