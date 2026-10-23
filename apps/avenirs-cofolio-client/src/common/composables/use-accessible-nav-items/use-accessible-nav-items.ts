import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'
import type { ROUTES } from '@/common/constants'
import type { RouteName } from '@/common/types/route-restrictions.types'
import { toValue } from 'vue'
import { useCanAccessRoute } from '@/common/composables/use-can-access-route/use-can-access-route'

interface NavLink {
  readonly to?: unknown
}

interface NavItem extends NavLink {
  readonly links?: readonly NavLink[]
}

function routeNameOf ({ to }: NavLink): string | undefined {
  return typeof to === 'object' && to !== null && 'name' in to && typeof to.name === 'string'
    ? to.name
    : undefined
}

/**
 * Keeps, among navigation items such as those of `AvNavigation`, those the current user can
 * access: the links whose route he can access, as {@link useCanAccessRoute} tells, and the
 * menus left with links. The routes are checked once, then again as `useCanAccessRoute()`
 * does: when the session or the authorization callbacks data changes.
 *
 * The items can change, their texts or highlighting for instance, but not the routes they
 * lead to: those are read when it is called, in `setup()`. A link whose `to` names no route,
 * such as a URL, is kept.
 *
 * @param items The navigation items, as a value, a ref or a getter.
 * @returns The items the current user can access: none until the checks give access.
 *
 * @example
 * const allNavItems = computed(() => [
 *   {
 *     id: 'nav-home',
 *     to: ROUTES.STUDENT.HOME,
 *     text: t('...')
 *   },
 *   {
 *     id: 'nav-tools-menu',
 *     title: t('...'),
 *     links: [{
 *       to: ROUTES.STUDENT.TOOLS_KIT,
 *       text: t('...')
 *     }]
 *   }
 * ])
 * const navItems = useAccessibleNavItems(allNavItems)
 */
export function useAccessibleNavItems<TItem extends NavItem> (items: MaybeRefOrGetter<readonly TItem[]>): ComputedRef<TItem[]> {
  const accesses = new Map<string, Readonly<Ref<boolean>>>()
  for (const name of toValue(items).flatMap(item => [item, ...item.links ?? []]).map(routeNameOf)) {
    if (name !== undefined && !accesses.has(name)) {
      accesses.set(name, useCanAccessRoute({ name } as { readonly name: RouteName<typeof ROUTES> }))
    }
  }

  const canAccess = (link: NavLink) => {
    const name = routeNameOf(link)
    return name === undefined || accesses.get(name)?.value === true
  }

  return computed(() => toValue(items).flatMap((item) => {
    if (!item.links) {
      return canAccess(item) ? [item] : []
    }

    const links = item.links.filter(canAccess)
    return links.length ? [{ ...item, links }] : []
  }))
}
