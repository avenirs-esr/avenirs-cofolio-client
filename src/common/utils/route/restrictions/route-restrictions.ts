import type { RouteRecordRaw } from 'vue-router'
import type { AccessRestrictions, RestrictionTree, RouteLeaf, RouteName, RouteRestrictions } from '@/common/types/route-restrictions'
import { ROUTES } from '@/common/constants'
import { ROUTE_RESTRICTIONS } from '@/common/constants/route-restrictions'

type Tree = Readonly<Record<string, unknown>>
type Conditions = readonly (readonly unknown[])[]

const NO_CONDITIONS: RouteRestrictions = {
  universes: [],
  roles: []
}
const RESTRICTION_KEYS = Object.keys(NO_CONDITIONS) as readonly (keyof RouteRestrictions)[]

let restrictionsByName: ReadonlyMap<string, RouteRestrictions | undefined> | undefined

function addCondition (conditions: Conditions, values: readonly unknown[] = []): Conditions {
  return values.length ? [...conditions, [...new Set(values)]] : conditions
}

function assertKnownKeys (node: Tree, knownKeys: readonly string[], path: string): void {
  const unknownKey = Object.keys(node).find(key => !knownKeys.includes(key))
  if (unknownKey !== undefined) {
    throw new Error(`[route-restrictions] Unknown key "${unknownKey}" at ${path}`)
  }
}

function cumulate (inherited: RouteRestrictions, restriction: Tree, path: string): RouteRestrictions {
  assertKnownKeys(restriction, RESTRICTION_KEYS, path)

  const own = restriction as AccessRestrictions
  return Object.fromEntries(RESTRICTION_KEYS.map(key => [key, addCondition(inherited[key], own[key])])) as RouteRestrictions
}

function hasConditions (restrictions: RouteRestrictions): boolean {
  return RESTRICTION_KEYS.some(key => restrictions[key].length > 0)
}

function isRouteLeaf (node: Tree): node is Tree & RouteLeaf {
  return typeof node.name === 'string' && typeof node.path === 'string'
}

function isRestriction (node: Tree): boolean {
  return RESTRICTION_KEYS.some(key => key in node)
}

function toTree (value: unknown): Tree {
  return (value ?? {}) as Tree
}

/**
 * Walks `ROUTES` and `ROUTE_RESTRICTIONS` side by side and returns, for each route, the
 * conditions declared from the root down to the route (see RouteRestrictions), or
 * `undefined` if there is none.
 *
 * Throws on a key that matches nothing (a typo must never silently drop a restriction)
 * and on a duplicate route name.
 */
function visit (
  resolved: Map<string, RouteRestrictions | undefined>,
  routesNode: Tree,
  restrictionNode: Tree,
  inherited: RouteRestrictions,
  path: string
) {
  if (isRouteLeaf(routesNode)) {
    if (resolved.has(routesNode.name)) {
      throw new Error(`[route-restrictions] Duplicate route name "${routesNode.name}" at ${path}`)
    }

    const restrictions = cumulate(inherited, restrictionNode, path)
    resolved.set(routesNode.name, hasConditions(restrictions) ? restrictions : undefined)
    return
  }

  // A group takes either a restriction applying to the whole group, or `{ default?, ...children }`.
  const { default: own, ...children } = isRestriction(restrictionNode)
    ? { default: restrictionNode }
    : restrictionNode
  assertKnownKeys(children, Object.keys(routesNode), path)

  const next = cumulate(inherited, toTree(own), path)
  for (const [key, child] of Object.entries(routesNode)) {
    visit(resolved, toTree(child), toTree(children[key]), next, `${path}.${key}`)
  }
}

function resolveRouteRestrictions<TRoutes extends object> (
  routes: TRoutes,
  restrictions: RestrictionTree<TRoutes>,
): ReadonlyMap<string, RouteRestrictions | undefined> {
  const resolved = new Map<string, RouteRestrictions | undefined>()
  visit(resolved, toTree(routes), toTree(restrictions), NO_CONDITIONS, 'ROUTES')
  return resolved
}

function getRestrictionsByName (): ReadonlyMap<string, RouteRestrictions | undefined> {
  restrictionsByName ??= resolveRouteRestrictions(ROUTES, ROUTE_RESTRICTIONS)
  return restrictionsByName
}

/**
 * Returns a copy of `records` (children included) in which every record of a route of
 * `ROUTES` having restrictions gets them in `meta.restrictedTo`.
 *
 * The other records are left as they are: they inherit the restrictions of their parent
 * record, or are public.
 *
 * Meant to be called once, before `createRouter()`.
 */
export function applyRouteRestrictions (...records: readonly RouteRecordRaw[]): RouteRecordRaw[] {
  const restrictions = getRestrictionsByName()

  const apply = (record: RouteRecordRaw): RouteRecordRaw => {
    const copy = { ...record }
    const restrictedTo = typeof record.name === 'string' ? restrictions.get(record.name) : undefined

    if (restrictedTo) {
      copy.meta = { ...record.meta, restrictedTo }
    }

    if (copy.children) {
      copy.children = copy.children.map(apply)
    }

    return copy
  }

  return records.map(apply)
}

/**
 * Returns the restrictions of a route of `ROUTES`, or `undefined` if it has none (public
 * route): the very object set in its `meta.restrictedTo`.
 *
 * For the current route, `useRoute().meta.restrictedTo` gives the same result.
 */
export function getRouteRestrictions (name: RouteName<typeof ROUTES>): RouteRestrictions | undefined {
  return getRestrictionsByName().get(name)
}
