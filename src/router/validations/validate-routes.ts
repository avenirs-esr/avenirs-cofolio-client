import type { RouteMeta, RouteRecordName, RouteRecordRaw } from 'vue-router'

/**
 * Dev safety net: the guard only restricts the routes that declare `meta.roles`, so a route that is
 * neither public nor restricted would silently be open to every authenticated user.
 *
 * Throws, listing every offending route at once, unless each route either:
 * - is public (`meta.public`),
 * - is restricted to roles (`meta.roles`, not empty),
 * - is deliberately open to every authenticated user, which is stated by passing its name in `ignored`.
 *
 * @param records Route table to check.
 * @param ignored Names of the routes deliberately open to every authenticated user. They are matched
 * against the leaf routes only: ignoring a layout record does not exempt its children.
 */
export function validateRoutes (records: readonly RouteRecordRaw[], ...ignored: RouteRecordName[]): void {
  const offenders = findRoutesWithoutRoles(records, ignored, {})

  if (offenders.length) {
    throw new Error(
      `[router] ${offenders.length} route(s) neither public nor restricted to roles: ${offenders.join(', ')}. `
      + 'Declare meta.public or meta.roles on them, or pass their name to validateRoutes() when they are open to every authenticated user.'
    )
  }
}

/**
 * `meta` is merged from the parents down, as vue-router does for `to.meta`, so roles declared on a
 * layout record cover its children. Only the leaves are checked, as the parents are not what a
 * navigation ends on. Redirections are skipped: the guards only ever see their target.
 */
function findRoutesWithoutRoles (records: readonly RouteRecordRaw[], ignored: RouteRecordName[], inheritedMeta: RouteMeta): string[] {
  return records.flatMap((record) => {
    const meta: RouteMeta = { ...inheritedMeta, ...record.meta }

    if (record.children?.length) {
      return findRoutesWithoutRoles(record.children, ignored, meta)
    }

    if ((record.path !== undefined && ignored.includes(record.name)) || record.redirect) {
      return []
    }

    if (meta.public !== true && (!Array.isArray(meta.roles) || !meta.roles.length)) {
      return [String(record.name ?? record.path)]
    }

    return []
  })
}
