import type { MaybeRefOrGetter, Ref } from 'vue'
import type { ROUTES } from '@/common/constants'
import type { RouteAccessParams } from '@/common/types/route-access.types'
import type { RouteName } from '@/common/types/route-restrictions.types'
import { getCurrentInstance, getCurrentScope, readonly, toValue } from 'vue'
import { canAccessRoute } from '@/common/utils/route/access/route-access'

type RefsOrGetters<TItems extends readonly unknown[]> = { [K in keyof TItems]: MaybeRefOrGetter<TItems[K]> }

/**
 * {@link canAccessRoute} as a ref, for a template: `false` until the check gives access.
 *
 * Checked again, it keeps its value meanwhile, when the session changes, when the data of
 * the callbacks may have changed (a query read through `fetchAuthorizationQuery()`
 * invalidated, or `invalidateRouteAccess()` called), or when a reactive value they read
 * before their first `await` changes. When the params change, it is `false` until checked
 * again: they designate another element.
 *
 * The callbacks run in the app context, as in a navigation guard: before their first `await`,
 * they can use composables relying on `inject()`, even when checked again.
 *
 * To call in `setup()`, not in a template: there, it would create a new ref, and start a new
 * check, at every render. It throws if called outside of `setup()` or of an effect scope.
 *
 * @param route The route, as an entry of `ROUTES` or a location naming one.
 * @param params The route params, as `canAccessRoute()` takes them, each as a value,
 * a ref or a getter: only refs and getters are followed.
 * @returns A read-only ref, `true` once the user is known to be able to access the route.
 *
 * @example
 * // <RouterLink v-if="canOpenUser" :to="...">
 * const canOpenUser = useCanAccessRoute(
 *   ROUTES.STAFF.ADMIN.GROUP.USER,
 *   () => props.groupId,
 *   () => props.userId
 * )
 */
export function useCanAccessRoute<TRoute extends { readonly name: RouteName<typeof ROUTES> }> (
  route: TRoute,
  ...params: RefsOrGetters<RouteAccessParams<TRoute['name']>>
): Readonly<Ref<boolean>> {
  if (!getCurrentScope()) {
    throw new Error('[useCanAccessRoute] Call it in setup(), not in a template, where it would start a new check at every render')
  }

  const app = getCurrentInstance()?.appContext.app
  const canAccess = ref(false)
  let checkedValues: readonly unknown[] | undefined

  watchEffect(async (onCleanup) => {
    let isStale = false

    onCleanup(() => {
      isStale = true
    })

    const values = params.map(param => toValue(param)) as RouteAccessParams<TRoute['name']>

    // Other params designate another element, unknown until checked: the same ones, checked
    // again, keep their access meanwhile.
    if (!checkedValues || values.some((value, index) => !Object.is(value, checkedValues?.[index]))) {
      canAccess.value = false
    }
    checkedValues = values

    const checkRouteAccess = () => canAccessRoute(route, ...values)
    const result = await (app ? app.runWithContext(checkRouteAccess) : checkRouteAccess())

    if (!isStale) {
      canAccess.value = result
    }
  })

  return readonly(canAccess)
}
