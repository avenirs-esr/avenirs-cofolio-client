import type { ROUTES } from '@/common/constants'
import type { AccessRights, RouteName, RouteRestrictions } from '@/common/types/route-restrictions'
import { getRouteRestrictions } from '@/common/utils/route/restrictions/route-restrictions'
import { useCurrentUserSession } from '@/features/auth/global/composables/use-current-user-session/use-current-user-session'

function getAcceptedUniverses (conditions: RouteRestrictions['universes'], universes: AccessRights['universes']) {
  const accepted = universes.filter(universe => conditions.every(condition => condition.includes(universe)))

  return accepted.length || !conditions.length ? accepted : undefined
}

function getAcceptedRoles (conditions: RouteRestrictions['roles'], roles: AccessRights['roles']) {
  if (!conditions.every(condition => condition.some(role => roles.includes(role)))) {
    return undefined
  }

  return conditions.length
    ? roles.filter(role => conditions.some(condition => condition.includes(role)))
    : roles
}

/**
 * Compares the restrictions of a route with the rights of the current user.
 *
 * @param target The route, as an entry of `ROUTES` or a location naming one, or directly
 * its restrictions, `undefined` when it has none.
 * @returns `undefined` when the user cannot access the route. Otherwise, for each criterion,
 * the values of the user that the route accepts, or all of them when the route does not
 * constrain this criterion.
 */
export function getRouteAccessRights (target: { readonly name: RouteName<typeof ROUTES> } | RouteRestrictions | undefined): AccessRights | undefined {
  const { roles, universes } = useCurrentUserSession()
  const restrictions = target && 'name' in target
    ? getRouteRestrictions(target.name)
    : target

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

  return {
    universes: acceptedUniverses,
    roles: acceptedRoles
  }
}

/**
 * Whether the current user can access a route.
 *
 * @param target The route, as an entry of `ROUTES` or a location naming one.
 * @param target.name Name of the route.
 * @returns `true` when the user can access the route, `false` otherwise.
 */
export function canAccessRoute (target: { readonly name: RouteName<typeof ROUTES> }): boolean {
  return getRouteAccessRights(target) !== undefined
}
