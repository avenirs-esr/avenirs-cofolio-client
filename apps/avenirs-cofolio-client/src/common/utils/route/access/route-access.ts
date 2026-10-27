import type { RouteMeta } from 'vue-router'
import type { ROUTES } from '@/common/constants'
import type { RouteAccessParams } from '@/common/types/route-access.types'
import type { AccessRights, LocationParams, RouteName, RouteRestrictions } from '@/common/types/route-restrictions.types'
import { routeAccessVersion } from '@/common/utils/route/access-state/route-access-state'
import { getRouteRestrictions } from '@/common/utils/route/restrictions/route-restrictions'
import { useCurrentUserSession } from '@/features/auth/global/composables/use-current-user-session/use-current-user-session'

type ParamMapper = (name: string, index: number) => unknown

interface ResolvedLocation {
  readonly meta: RouteMeta
  readonly params: LocationParams
}

function getAcceptedUniverses (
  conditions: RouteRestrictions['universes'],
  universes: AccessRights['universes']
): AccessRights['universes'] | undefined {
  const accepted = universes.filter(universe => conditions.every(condition => condition.includes(universe)))

  return accepted.length || !conditions.length
    ? accepted
    : undefined
}

function getAcceptedRoles (
  conditions: RouteRestrictions['roles'],
  roles: AccessRights['roles']
): AccessRights['roles'] | undefined {
  if (!conditions.every(condition => condition.some(role => roles.includes(role)))) {
    return undefined
  }

  return conditions.length
    ? roles.filter(role => conditions.some(condition => condition.includes(role)))
    : roles
}

async function isAuthorized (
  authorizations: RouteRestrictions['authorizations'],
  paramMapper: ParamMapper
): Promise<boolean> {
  if (!authorizations.length) {
    return true
  }

  // Read before the callbacks: an effect checking the access runs again once their data may
  // have changed (see `invalidateRouteAccess()`)
  routeAccessVersion()

  const mappedAuthorizations = authorizations.map(({ isAuthorized, paramNames }) => isAuthorized(...paramNames.map(paramMapper)))
  const authorized = await Promise.all(mappedAuthorizations)
  return authorized.every(Boolean)
}

async function checkAccess (
  restrictions: RouteRestrictions | undefined,
  paramMapper: ParamMapper
): Promise<AccessRights | undefined> {
  const { roles, universes } = useCurrentUserSession()

  if (!restrictions) {
    return {
      universes: universes.available.value,
      roles: roles.value
    }
  }

  const acceptedUniverses = getAcceptedUniverses(restrictions.universes, universes.available.value)
  if (!acceptedUniverses) {
    return undefined
  }

  const acceptedRoles = getAcceptedRoles(restrictions.roles, roles.value)
  if (!acceptedRoles) {
    return undefined
  }

  if (!await isAuthorized(restrictions.authorizations, paramMapper)) {
    return undefined
  }

  return {
    universes: acceptedUniverses,
    roles: acceptedRoles
  }
}

/**
 * Compares the criteria of a location with the rights of the current session, then, if they
 * are met, calls its authorization callbacks: that of the route with its params, in the
 * order of the path, those of the groups without.
 *
 * The callbacks start right away, together, before this function returns: called before the
 * first `await` of a navigation guard, they can use composables relying on `inject()`.
 *
 * Called in an effect, as `useCanAccessRoute()` does, the check runs again when the rights
 * of the user change, and, for a route with callbacks, when their data may have changed: a
 * query read through `fetchAuthorizationQuery()` invalidated, or `invalidateRouteAccess()`
 * called.
 *
 * @param location The location, as resolved by vue-router: `to` in a navigation guard, or
 * what `router.resolve()` returns.
 * @returns `undefined` when the user does not meet the criteria of the route, or when a
 * callback denies access. Otherwise, for each criterion, the values of the user that the
 * route accepts, or all of them when the route does not constrain this criterion. Rejects if
 * a callback throws or rejects.
 *
 * @example
 * // In a navigation guard.
 * router.beforeEach(async (to) => {
 *   try {
 *     return await checkRouteAccess(to)
 *       ? true
 *       : { name: ROUTES.STAFF.HOME.name }
 *   } catch {
 *     // A callback threw.
 *     return { name: ROUTES.STAFF.HOME.name }
 *   }
 * })
 */
export function checkRouteAccess (location: ResolvedLocation): Promise<AccessRights | undefined> {
  return checkAccess(location.meta.restrictions, name => location.params[name] || undefined)
}

/**
 * Whether the current user can access a route: checked as {@link checkRouteAccess}.
 *
 * @param route The route, as an entry of `ROUTES` or a location naming one.
 * @param params The params of the route, as its `isAuthorized` callback gets them: in the
 * order they appear in its path, none when it has none.
 * @returns `true` when the user can access the route, `false` otherwise.
 *
 * @example
 * // 'admin/group/:groupId/user/:userId'
 * await canAccessRoute(ROUTES.STAFF.ADMIN.GROUP.USER, groupId, userId)
 *
 * // 'activities/catalog/:thematic?/:id?': optional params, left out
 * await canAccessRoute(ROUTES.STUDENT.ACTIVITIES_CATALOG)
 */
export async function canAccessRoute<TRoute extends { readonly name: RouteName<typeof ROUTES> }> (
  route: TRoute,
  ...params: RouteAccessParams<TRoute['name']>
): Promise<boolean> {
  try {
    return await checkAccess(getRouteRestrictions(route.name), (_, index) => params[index]) !== undefined
  }
  catch {
    return false
  }
}
