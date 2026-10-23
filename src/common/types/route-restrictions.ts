import type { ERole, EUniverse } from '@/api/avenir-esr'

type Without<T> = { readonly [K in keyof T]?: never }
type OneOf<A, B> = (A & Without<B>) | (B & Without<A>)

/**
 * The restriction criteria, each with the values giving access to the route: the only place
 * where they are listed.
 *
 * Every level of `ROUTE_RESTRICTIONS` that declares a criterion adds a condition: the user
 * must match at least one of its values. The conditions of all the levels add up, so a
 * sub-level can only narrow access. An empty or absent list adds no condition.
 */
export interface AccessRestrictions {
  /**
   * Universes giving access to the route: the user must belong to at least one of them.
   */
  readonly universes?: readonly EUniverse[]
  /**
   * Roles giving access to the route: the user must hold at least one of them.
   */
  readonly roles?: readonly ERole[]
}

/**
 * For each criterion, the values held by a user or, among them, those a route accepts.
 */
export type AccessRights = Required<AccessRestrictions>

/**
 * The resolved restrictions of a route: for each criterion, the condition of every level
 * declaring it, from the root of `ROUTES` down to the route.
 *
 * Access requires at least one value of each condition. Every criterion is present, without
 * any condition when no level declares it.
 */
export type RouteRestrictions = {
  readonly [K in keyof AccessRights]: readonly AccessRights[K][]
}

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * Access restrictions of the route, set by `applyRouteRestrictions()` on the routes of
     * `ROUTES` having some: never set by hand.
     *
     * A route with restrictions requires a session. A record without them inherits those of its
     * parent, as vue-router merges `meta` from parent to child, or has none: it is public.
     */
    restrictedTo?: RouteRestrictions
  }
}

/**
 * An entry of `ROUTES`.
 */
export interface RouteLeaf {
  readonly name: string
  readonly path: string
}

/**
 * The name of any route of `TRoutes`: `RouteName<typeof ROUTES>` is `'auth-accessibility' |
 * 'auth-cgu' | ...`.
 */
export type RouteName<TRoutes> = TRoutes extends RouteLeaf
  ? TRoutes['name']
  : { [K in keyof TRoutes]: RouteName<TRoutes[K]> }[keyof TRoutes]

/**
 * A group of `ROUTE_RESTRICTIONS`, in one of the two forms described in
 * {@link RestrictionTree}.
 */
type RestrictionGroup<TGroup> = OneOf<AccessRestrictions, { readonly default?: AccessRestrictions } & RestrictionTree<TGroup>>

/**
 * Shape of `ROUTE_RESTRICTIONS`, derived from the shape of `ROUTES`, so that an unknown or
 * misspelled key does not compile.
 *
 * Every key is optional:
 * - a route takes {@link AccessRestrictions};
 * - a group takes either {@link AccessRestrictions}, which apply to every route of the group,
 *   or `{ default?, ...children }`, where `default` does.
 *
 * The restrictions of a level apply to everything below it, and add up with those of the
 * sub-levels: under `STAFF.ADMIN` (`ROLE_ADMIN`), `USERS` (`ROLE_EXTERNAL_USER_MANAGER`)
 * requires both roles.
 *
 * Alternatives go in the same list: `USERS: { roles: [ROLE_ADMIN, ROLE_EXTERNAL_USER_MANAGER
 * ] }` accepts either, as long as no level above requires one of them.
 */
export type RestrictionTree<TRoutes> = {
  readonly [K in keyof TRoutes]?: TRoutes[K] extends RouteLeaf ? AccessRestrictions : RestrictionGroup<TRoutes[K]>
}
