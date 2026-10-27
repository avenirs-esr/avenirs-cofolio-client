import type { ERole, EUniverse } from '@/api/avenir-esr'

type Without<T> = { readonly [K in keyof T]?: never }
type OneOf<A, B> = (A & Without<B>) | (B & Without<A>)
type CharOf<TString extends string, TChars = never> = TString extends `${infer TChar}${infer TRest}`
  ? CharOf<TRest, TChars | TChar>
  : TChars

/**
 * An entry of `ROUTES`.
 */
export interface RouteLeaf {
  readonly name: string
  readonly path: string
}

/**
 * Any route of `TRoutes`: `RouteOf<typeof ROUTES>` is the union of the entries of `ROUTES`.
 */
export type RouteOf<TRoutes> = TRoutes extends RouteLeaf
  ? TRoutes
  : { [K in keyof TRoutes]: RouteOf<TRoutes[K]> }[keyof TRoutes]

/**
 * The name of any route of `TRoutes`: `RouteName<typeof ROUTES>` is `'auth-accessibility' |
 * 'auth-cgu' | ...`.
 */
export type RouteName<TRoutes> = TRoutes extends RouteLeaf
  ? TRoutes['name']
  : { [K in keyof TRoutes]: RouteName<TRoutes[K]> }[keyof TRoutes]

interface ParamValueByModifier {
  '?': string | undefined
  '+': readonly string[]
  '*': readonly string[] | undefined
}

type ParamValueOf<TParam extends string> = TParam extends `${infer TChar}${infer TRest}`
  ? TChar extends CharOf<'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_'>
    ? ParamValueOf<TRest>
    : (TParam extends `(${string})${infer TModified}` ? TModified : TParam) extends `${infer TModifier extends keyof ParamValueByModifier}${string}`
        ? ParamValueByModifier[TModifier]
        : string
  : string

type PathParams<TPath extends string, TParams extends readonly unknown[] = []> = TPath extends `${string}:${infer TParam}`
  ? PathParams<TParam, [...TParams, ParamValueOf<TParam>]>
  : TParams

/**
 * The params of a route, as its `isAuthorized` callback gets them and `canAccessRoute()`
 * takes them: one per param, in the order they appear in the path.
 *
 * `RouteParamsOf<typeof ROUTES.STAFF.ADMIN.GROUP.USER>` is `[string, string]`: `:groupId`,
 * then `:userId`.
 */
export type RouteParamsOf<TRoute extends RouteLeaf> = PathParams<TRoute['path']>

/**
 * A callback of `ROUTE_RESTRICTIONS` telling whether the current user is authorized to
 * access a location: see {@link AccessRestrictions.isAuthorized}.
 *
 * @example
 * // A callback shared by routes with the same params, typed by its own params
 * const ownsTrace: Authorization<[id: string]> = id => isTraceOwner(id)
 *
 * export const ROUTE_RESTRICTIONS = {
 *   STUDENT: {
 *     TRACE: { isAuthorized: ownsTrace },
 *     TOOLS_TRACE: { isAuthorized: ownsTrace },
 *   },
 * } satisfies RestrictionTree<typeof ROUTES>
 */
export type Authorization<TParams extends readonly unknown[] = readonly unknown[]> = (...params: TParams) => boolean | Promise<boolean>

/**
 * The restriction criteria, each with the values giving access to the route: the only place
 * where they are listed.
 *
 * Every level of `ROUTE_RESTRICTIONS` that declares a criterion adds a condition: the user
 * must match at least one of its values. The conditions of all the levels add up, so a
 * sub-level can only narrow access. An empty or absent list adds no condition.
 */
export interface AccessCriteria {
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
 * What a level of `ROUTE_RESTRICTIONS` declares: criteria, and an authorization callback.
 */
export interface AccessRestrictions<TParams extends readonly unknown[] = readonly unknown[]> extends AccessCriteria {
  /**
   * Whether the current user is authorized to access the location, for what the criteria
   * cannot express: typically, whether they can view, edit, delete... the element its params
   * designate, by calling an endpoint or a composable. It gives access by returning, or
   * resolving to, `true`.
   *
   * On a route, it gets its params as arguments, in the order they appear in the path:
   * `'admin/group/:groupId/user/:userId'` gives `(groupId, userId)`. An absent optional param
   * is `undefined`. On a group, it gets nothing: a callback needing params goes on the routes
   * that have them.
   *
   * It runs once the criteria of every level are met. The callbacks of all the levels add up:
   * they run together, and must all give access.
   *
   * Its errors make `checkRouteAccess()` reject, so it should return `false` for the responses
   * meaning "not authorized"; `canAccessRoute()` takes them as a denial.
   *
   * It is called again, with the current params, when what the access depends on changes: the
   * session rights, or its data, a query read through `fetchAuthorizationQuery()` being
   * invalidated, or `invalidateRouteAccess()` being called. By the router for the displayed page,
   * which sends the user home once the access is lost, and for the pending navigation, which then
   * ends on the not found page. By `useCanAccessRoute()` for its route.
   *
   * @example
   * // The path params, in order; nothing on a group
   * STAFF: {
   *   default: {
   *     universes: [EUniverse.STAFF],
   *     isAuthorized: () => isModuleEnabled('staff')
   *   },
   *   ADMIN: {
   *     GROUP: {
   *       USER: {
   *         // 'admin/group/:groupId/user/:userId'
   *         isAuthorized: (groupId, userId) => canManageUser(groupId, userId)
   *       },
   *     },
   *   },
   * },
   * STUDENT: {
   *   ACTIVITIES_CATALOG: {
   *     // 'activities/catalog/:thematic?/:id?': an absent optional param is `undefined`
   *     isAuthorized: (thematic, id) => id === undefined || canSeeActivity(id)
   *   },
   * },
   *
   * @example
   * // A query, through fetchAuthorizationQuery() before the first `await`: the access is checked
   * // again whenever it is invalidated. With the key of the page query, the page reuses it.
   * STAFF: {
   *   ADMIN: {
   *     GROUP: {
   *       USER: {
   *         isAuthorized: async (groupId, userId) => {
   *           const { canManage } = await fetchAuthorizationQuery({
   *             queryKey: getGetGroupUserQueryKey(groupId, userId),
   *             queryFn: () => getGroupUser(groupId, userId),
   *           })
   *           return canManage
   *         },
   *       },
   *     },
   *   },
   * },
   *
   * @example
   * // An endpoint: `false` for the responses meaning "not authorized"
   * STAFF: {
   *   ACTIVITY_FEEDBACK: {
   *     isAuthorized: async (feedbackId) => {
   *       try {
   *         await fetchAuthorizationQuery({
   *           queryKey: getGetFeedbackQueryKey(feedbackId),
   *           queryFn: () => getFeedback(feedbackId),
   *         })
   *         return true
   *       } catch (error) {
   *         if (isForbiddenOrNotFound(error)) {
   *           return false
   *         }
   *         throw error
   *       }
   *     },
   *   },
   * },
   *
   * @example
   * // A composable: called before the first `await` (see `checkRouteAccess()`)
   * STUDENT: {
   *   UPDATE_TRACE: {
   *     isAuthorized: async (id) => {
   *       const { canEdit } = useTraceAccess()
   *       return canEdit(await fetchTrace(id))
   *     },
   *   },
   * },
   */
  readonly isAuthorized?: Authorization<TParams>
}

type RestrictionGroup<TGroup> = OneOf<AccessRestrictions<[]>, { readonly default?: AccessRestrictions<[]> } & RestrictionTree<TGroup>>

/**
 * Shape of `ROUTE_RESTRICTIONS`, derived from the shape of `ROUTES`, so that an unknown or
 * misspelled key does not compile.
 *
 * Every key is optional:
 * - a route takes {@link AccessRestrictions}, whose callback gets the route params;
 * - a group takes either {@link AccessRestrictions}, which apply to every route of the group,
 *   or `{ default?, ...children }`, where `default` does; its callback gets nothing.
 *
 * The restrictions of a level apply to everything below it, and add up with those of the
 * sub-levels: under `STAFF.ADMIN` (`ROLE_ADMIN`), `USERS` (`ROLE_EXTERNAL_USER_MANAGER`)
 * requires both roles.
 *
 * Alternatives go in the same list: `USERS: { roles: [ROLE_ADMIN, ROLE_EXTERNAL_USER_MANAGER
 * ] }` accepts either, as long as no level above requires one of them.
 *
 * @example
 * STAFF: {
 *   default: {
 *     // Every route of STAFF
 *     universes: [EUniverse.STAFF]
 *   },
 *   ACTIVITY_FEEDBACK: {
 *     // Either role
 *     roles: [
 *       ERole.ROLE_STAFF_FEEDBACK_RESPONDER,
 *       ERole.ROLE_STAFF_FEEDBACK_SUPERVISOR
 *     ]
 *   },
 *   STUDENT_TRACKING: {
 *     // Every route of STUDENT_TRACKING
 *     roles: [ERole.ROLE_STAFF_FEEDBACK_RESPONDER]
 *   },
 *   ADMIN: {
 *     default: {
 *       roles: [ERole.ROLE_ADMIN]
 *     },
 *     USERS: {
 *       // ROLE_ADMIN and ROLE_EXTERNAL_USER_MANAGER
 *       roles: [ERole.ROLE_EXTERNAL_USER_MANAGER]
 *     },
 *   },
 * },
 */
export type RestrictionTree<TRoutes> = {
  readonly [K in keyof TRoutes]?: TRoutes[K] extends RouteLeaf
    ? AccessRestrictions<RouteParamsOf<TRoutes[K]>>
    : RestrictionGroup<TRoutes[K]>
}

/**
 * For each criterion, the values held by a user or, among them, those a route accepts.
 */
export type AccessRights = Required<AccessCriteria>

/**
 * The resolved restrictions of a route: for each criterion, the condition of every level
 * declaring it, and the authorization callback of every level declaring one, from the root
 * of `ROUTES` down to the route.
 *
 * Access requires at least one value of each condition, then every callback to give access.
 * Every criterion is present, without any condition when no level declares it.
 */
export type RouteRestrictions = {
  readonly [K in keyof AccessRights]: readonly AccessRights[K][]
} & {
  readonly authorizations: readonly {
    readonly isAuthorized: Authorization
    /**
     * The params names the callback gets, in order: those of the path for the
     * route callback, none for that of a group.
     */
    readonly paramNames: readonly string[]
  }[]
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
    restrictions?: RouteRestrictions
  }
}

/**
 * The params of a location resolved by vue-router (`to` in a navigation guard, what
 * `router.resolve()` returns): a string for each param, a list of strings for a repeatable
 * one.
 */
export type LocationParams = Readonly<Record<string, string | readonly string[]>>
