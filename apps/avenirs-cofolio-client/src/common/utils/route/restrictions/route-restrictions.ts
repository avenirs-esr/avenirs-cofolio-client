import type { RouteRecordRaw } from 'vue-router'
import type { AccessRestrictions, RouteLeaf, RouteName, RouteRestrictions } from '@/common/types/route-restrictions.types'
import { ROUTES } from '@/common/constants'
import { ROUTE_RESTRICTIONS } from '@/common/constants/route-restrictions'

type Tree = Readonly<Record<string, unknown>>
type Conditions = readonly (readonly unknown[])[]

const NO_CONDITIONS: Omit<RouteRestrictions, 'authorizations'> = {
  universes: [],
  roles: []
}
const CRITERIA = Object.keys(NO_CONDITIONS) as readonly (keyof typeof NO_CONDITIONS)[]
const RESTRICTION_KEYS: readonly string[] = [...CRITERIA, 'isAuthorized' satisfies keyof AccessRestrictions]

function toTree (value: unknown): Tree {
  return (value ?? {}) as Tree
}

function assertKnownKeys (node: Tree, knownKeys: readonly string[], keyPath: string) {
  const unknownKey = Object.keys(node).find(key => !knownKeys.includes(key))
  if (unknownKey !== undefined) {
    throw new Error(`[route-restrictions] Unknown key "${unknownKey}" at ${keyPath}`)
  }
}

function isRouteLeaf (node: Tree): node is Tree & RouteLeaf {
  return typeof node.name === 'string' && typeof node.path === 'string'
}

function addCondition (conditions: Conditions, values: readonly unknown[] = []): Conditions {
  return values.length ? [...conditions, [...new Set(values)]] : conditions
}

function cumulate (
  inherited: RouteRestrictions,
  restriction: Tree,
  keyPath: string,
  paramNames: readonly string[] = []
): RouteRestrictions {
  assertKnownKeys(restriction, RESTRICTION_KEYS, keyPath)

  const { isAuthorized, ...criteria } = restriction as AccessRestrictions
  return {
    ...Object.fromEntries(CRITERIA.map(key => [key, addCondition(inherited[key], criteria[key])])) as typeof NO_CONDITIONS,
    authorizations: isAuthorized
      ? [...inherited.authorizations, { isAuthorized, paramNames }]
      : inherited.authorizations
  }
}

function paramNamesOf (path: string): string[] {
  return path.match(/:\w+/g)?.map(param => param.slice(1)) ?? []
}

function hasRestrictions (restrictions: RouteRestrictions): boolean {
  return CRITERIA.some(key => restrictions[key].length > 0) || restrictions.authorizations.length > 0
}

function isRestriction (node: Tree): boolean {
  return RESTRICTION_KEYS.some(key => key in node)
}

/**
 * Walks `ROUTES` and `ROUTE_RESTRICTIONS` side by side and fills `resolved` with, for each
 * route, the conditions and authorizations declared from the root down to the route (see
 * `RouteRestrictions`), or `undefined` if there is none.
 *
 * Throws on a key that matches nothing (a typo must never silently drop a restriction) and
 * on a duplicate route name.
 */
function visit (
  resolved: Map<string, RouteRestrictions | undefined>,
  routesNode: Tree,
  restrictionNode: Tree,
  inherited: RouteRestrictions,
  keyPath: string
) {
  if (isRouteLeaf(routesNode)) {
    if (resolved.has(routesNode.name)) {
      throw new Error(`[route-restrictions] Duplicate route name "${routesNode.name}" at ${keyPath}`)
    }

    const restrictions = cumulate(inherited, restrictionNode, keyPath, paramNamesOf(routesNode.path))
    resolved.set(routesNode.name, hasRestrictions(restrictions) ? restrictions : undefined)
    return
  }

  // A group takes either a restriction applying to the whole group, or `{ default?, ...children }`.
  const { default: own, ...children } = isRestriction(restrictionNode)
    ? { default: restrictionNode }
    : restrictionNode
  assertKnownKeys(children, Object.keys(routesNode), keyPath)

  const next = cumulate(inherited, toTree(own), keyPath)
  for (const [key, child] of Object.entries(routesNode)) {
    visit(resolved, toTree(child), toTree(children[key]), next, `${keyPath}.${key}`)
  }
}

let restrictionsByName: ReadonlyMap<string, RouteRestrictions | undefined> | undefined

function getRestrictionsByName (): ReadonlyMap<string, RouteRestrictions | undefined> {
  if (!restrictionsByName) {
    const resolved = new Map<string, RouteRestrictions | undefined>()
    visit(resolved, ROUTES, ROUTE_RESTRICTIONS, { ...NO_CONDITIONS, authorizations: [] }, 'ROUTES')
    restrictionsByName = resolved
  }

  return restrictionsByName
}

/**
 * Sets the `ROUTES` restrictions having some in the `meta.restrictions` of their records.
 * The other records are left as they are: they inherit their parent restrictions or are
 * public.
 *
 * Meant to be called once, before `createRouter()`.
 *
 * @param records The router records, children included.
 * @returns A copy of `records`, the records given being left unchanged.
 */
export function applyRouteRestrictions (...records: readonly RouteRecordRaw[]): RouteRecordRaw[] {
  const allRestrictions = getRestrictionsByName()

  const apply = (record: RouteRecordRaw): RouteRecordRaw => {
    const copy = { ...record }
    const restrictions = typeof record.name === 'string'
      ? allRestrictions.get(record.name)
      : undefined

    if (restrictions) {
      copy.meta = {
        ...record.meta,
        restrictions
      }
    }

    if (copy.children) {
      copy.children = copy.children.map(apply)
    }

    return copy
  }

  return records.map(apply)
}

/**
 * Returns the restrictions of a route of `ROUTES`: the very object set in its
 * `meta.restrictions`, which `useRoute().meta.restrictions` gives for the current route.
 *
 * @param name The route name.
 * @returns Its restrictions, or `undefined` if it has none (public route).
 */
export function getRouteRestrictions (name: RouteName<typeof ROUTES>): RouteRestrictions | undefined {
  return getRestrictionsByName().get(name)
}
