import type { DefaultError, FetchQueryOptions, Query, QueryClient, QueryKey } from '@tanstack/vue-query'
import { useQueryClient } from '@tanstack/vue-query'
import { effectScope } from 'vue'
import { useAuthStore } from '@/features/auth/global/stores/auth.store'

interface Rights {
  readonly roles: readonly string[]
  readonly universes: readonly string[]
}

const version = ref(0)
const authorizationQueries = new WeakSet<Query>()
const followedClients = new WeakSet<QueryClient>()

function rightsOf (session: Rights | undefined): string {
  return session ? JSON.stringify([[...session.roles].sort(), [...session.universes].sort()]) : ''
}

/**
 * The session rights the access depends on.
 *
 * @returns Its roles and its universes, or an empty string without a session. A session
 * fetched again with the same rights gives the same value.
 */
export function sessionRights (): string {
  return rightsOf(useAuthStore().session)
}

/**
 * The access checks having callbacks read it before their first `await`: an effect checking
 * the access, as `useCanAccessRoute()` does, runs again when it changes. The router compares
 * it as well.
 *
 * @returns The authorization callbacks data version, incremented whenever it
 * may have changed.
 */
export function routeAccessVersion (): number {
  return version.value
}

/**
 * Checks again every access depending on authorization callbacks, for data they read
 * elsewhere than through {@link fetchAuthorizationQuery}: a store, a direct call to the
 * API... Data read through it is better invalidated instead: the access is then checked
 * again by itself.
 *
 * @example
 * // A callback reading a store
 * STAFF: {
 *   default: {
 *     isAuthorized: () => useModulesStore().isEnabled('staff')
 *   }
 * }
 *
 * // Once the store changed: the router checks the displayed page again, and
 * // `useCanAccessRoute()` its route
 * modulesStore.disable('staff')
 * invalidateRouteAccess()
 */
export function invalidateRouteAccess () {
  version.value++
}

/**
 * Follows, from now on, what makes the answers of the authorization queries of a client change.
 *
 * @param queryClient The query client to follow.
 */
function followAuthorizationQueries (queryClient: QueryClient) {
  if (followedClients.has(queryClient)) {
    return
  }

  followedClients.add(queryClient)

  // Invalidated, an authorization query may give another answer.
  queryClient.getQueryCache().subscribe((event) => {
    if (event.type === 'updated' && event.action.type === 'invalidate' && authorizationQueries.has(event.query)) {
      invalidateRouteAccess()
    }
  })

  // Given under other rights, the answers may no longer hold: invalidated, they are fetched
  // again at the next check. Synchronously, so that the checks following the change do not
  // reuse them. Not when the session appears or disappears: the auth store clears the cache at
  // logout.
  const authStore = useAuthStore()
  effectScope(true).run(() => {
    watch(() => rightsOf(authStore.session), (rights, previousRights) => {
      if (rights && previousRights) {
        void queryClient.invalidateQueries({
          predicate: query => authorizationQueries.has(query)
        })
      }
    }, { flush: 'sync' })
  })
}

/**
 * `queryClient.fetchQuery()` for an authorization callback (`isAuthorized`): the access is
 * checked again whenever this query is invalidated. The callbacks are then called again with
 * the current params: only the invalidated queries are fetched again.
 *
 * The queries it fetched are invalidated as well when the session rights change: an answer
 * given under other rights is fetched again at the next check.
 *
 * To call before the first callback `await`: it gets the app client with `useQueryClient()`.
 * Its errors reject, as those of `fetchQuery()`: the callback returns `false` for the
 * responses meaning "not authorized".
 *
 * @param options The query options, as `fetchQuery()` takes them.
 * @returns The query data.
 *
 * @example
 * USER: {
 *   isAuthorized: async (groupId, userId) => {
 *     const { canManage } = await fetchAuthorizationQuery({
 *       queryKey: getGetGroupUserQueryKey(groupId, userId),
 *       queryFn: () => getGroupUser(groupId, userId),
 *     })
 *     return canManage
 *   }
 * }
 */
export function fetchAuthorizationQuery<
  TQueryFnData,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> (options: FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>): Promise<TData> {
  const queryClient = useQueryClient()
  followAuthorizationQueries(queryClient)

  const data = queryClient.fetchQuery(options)
  const query = queryClient.getQueryCache().find({
    queryKey: options.queryKey,
    exact: true
  })

  if (query) {
    authorizationQueries.add(query)
  }

  return data
}
