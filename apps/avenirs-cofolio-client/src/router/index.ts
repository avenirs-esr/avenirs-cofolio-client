import type { RouteLocationNormalized } from 'vue-router'
import type { AccessRights } from '@/common/types/route-restrictions.types'
import { createRouter, createWebHistory, START_LOCATION } from 'vue-router'
import { ROUTES } from '@/common/constants'
import { routeAccessVersion, sessionRights } from '@/common/utils/route/access-state/route-access-state'
import { checkRouteAccess } from '@/common/utils/route/access/route-access'
import { applyRouteRestrictions } from '@/common/utils/route/restrictions/route-restrictions'
import { useCurrentUserSession } from '@/features/auth/global/composables/use-current-user-session/use-current-user-session'
import authRoutes from '@/features/auth/global/routes'
import { useAuthStore } from '@/features/auth/global/stores/auth.store'
import staffRoutes from '@/features/staff/global/routes'
import studentRoutes from '@/features/student/global/routes'

const MAIN_TITLE = 'Cofolio'
const ROOT_ROUTE_NAME = 'home'
const NOT_FOUND_ROUTE_NAME = 'NotFound'

const routes = applyRouteRestrictions(
  ...authRoutes,
  ...studentRoutes,
  ...staffRoutes,
  {
    path: '/',
    name: ROOT_ROUTE_NAME,
    component: { render: () => null }
  },
  {
    path: '/:pathMatch(.*)*',
    name: NOT_FOUND_ROUTE_NAME,
    component: () => import('@/common/views/NotFoundView/NotFoundView.vue')
  }
)

const router = createRouter({
  history: createWebHistory(import.meta.env?.BASE_URL || ''),
  routes,
  scrollBehavior: (to, _from, savedPosition) => {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }

    if (savedPosition) {
      return savedPosition
    }

    if (window.history.state?.preserveScroll) {
      return false
    }

    return { top: 0 }
  }
})

const navigationChecks = new WeakMap<RouteLocationNormalized, {
  /**
   * What the access was checked with, as {@link accessState} gives it.
   */
  readonly state: string
  /**
   * The universes the page accepts, one of which the afterEach switches to: none for a page
   * without restrictions.
   */
  readonly universes: AccessRights['universes']
}>()
const recheckedStates = new WeakMap<RouteLocationNormalized, string>()

let pendingNavigation: RouteLocationNormalized | undefined
let isAccessWatched = false

/**
 * What the access to a page depends on: the session rights and, for a page with
 * authorization callbacks, the version of their data. The page the not found page
 * stands for, at its address, is the one checked again.
 */
function accessState (to: RouteLocationNormalized): string {
  const rights = sessionRights()
  const { meta } = to.name === NOT_FOUND_ROUTE_NAME ? router.resolve(to.fullPath) : to

  return meta.restrictions?.authorizations.length
    ? `${rights}|${routeAccessVersion()}`
    : rights
}

/**
 * Checks the displayed page again if what its access depends on changed since it was
 * checked: the session rights, or the data of its authorization callbacks. Navigates to the
 * page again, without scrolling: the guards decide, as for any navigation, and the universe
 * is switched if needed.
 *
 * Not while a navigation is pending: its own check is redone if what it depends on changes
 * before it is confirmed (see the beforeResolve guard), and the displayed page is checked
 * again once it ends, confirmed or not. A session that disappears is left to the auth store,
 * which sends the user to login, or keeps a public page.
 *
 * Called in a task of its own, once the navigations started meanwhile have reached the first
 * guard, which tracks them: checking the page again would cancel them. A navigation still
 * held by an asynchronous `beforeRouteLeave` guard, waiting for a confirmation for instance,
 * is not seen yet.
 */
function revalidateDisplayedPage () {
  const displayed = router.currentRoute.value

  if (pendingNavigation || displayed === START_LOCATION || !useAuthStore().isLoggedIn) {
    return
  }

  const state = accessState(displayed)
  if (state === navigationChecks.get(displayed)?.state || state === recheckedStates.get(displayed)) {
    return
  }

  recheckedStates.set(displayed, state)
  void router.replace({
    path: displayed.path,
    query: displayed.query,
    hash: displayed.hash,
    force: true,
    state: {
      preserveScroll: true
    }
  }).catch(() => undefined)
}

/**
 * Ends the navigation in progress, if it is this one, whether it is confirmed, aborted or
 * ended by an error, then checks the displayed page again if needed.
 */
function endNavigation (to: RouteLocationNormalized) {
  if (to === pendingNavigation) {
    pendingNavigation = undefined
    setTimeout(revalidateDisplayedPage)
  }
}

// First guard: tracks the navigation in progress, and starts watching what the access
// depends on at the first navigation, from the app context the guards run in, which the auth
// store needs.
router.beforeEach((to) => {
  pendingNavigation = to

  if (!isAccessWatched) {
    isAccessWatched = true
    const authStore = useAuthStore()
    watch([() => authStore.session, routeAccessVersion], () => setTimeout(revalidateDisplayedPage))
  }
})

// Second guard: the redirects depending on the session. To login without any; then, for the
// logged-in user, from the login and root pages to where he is heading, and to the CGU page
// until he has accepted their latest version.
router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  // The root page and the restricted pages need a session, confirmed by `/me` once per page
  // load: only its answer tells whether the user is logged in. The other pages go on without
  // any.
  if (to.name === ROOT_ROUTE_NAME || to.meta.restrictions) {
    const toLogin = await authStore.ensureSession(to.fullPath)
    if (toLogin !== undefined) {
      return toLogin
    }
  }
  else if (!authStore.isLoggedIn) {
    return
  }

  const { universes, homeRoute, cgu } = useCurrentUserSession()

  // The login and root pages lead the user where he is heading: the page of the `redirect`
  // query parameter, else his home route. The guards check that navigation in turn: the CGU
  // page comes first if needed, then leads there.
  if (to.name === ROUTES.AUTH.LOGIN.name || to.name === ROOT_ROUTE_NAME) {
    const redirect = to.name === ROUTES.AUTH.LOGIN.name
      ? to.query.redirect
      : undefined

    if (
      redirect
      && typeof redirect === 'string'
      && redirect.startsWith('/')
      && router.resolve(redirect).name !== ROUTES.AUTH.LOGIN.name
    ) {
      return redirect
    }

    if (universes.hasActive.value) {
      return homeRoute.value
    }

    return to.name === ROOT_ROUTE_NAME
      ? undefined
      : { name: ROOT_ROUTE_NAME }
  }

  // Any other page waits for the latest CGU to be accepted, on the CGU page of the active
  // universe, which leads to the page afterwards (`redirect` query parameter). Except that CGU
  // page itself, which would redirect to itself endlessly, and the not found page, which the
  // CGU page would lead to, were it inaccessible, and back, endlessly.
  if (
    universes.hasActive.value
    && !cgu.hasAcceptedLatest.value
    && to.name !== cgu.route.value.name
    && to.name !== NOT_FOUND_ROUTE_NAME
  ) {
    return {
      name: cgu.route.value.name,
      query: {
        redirect: to.fullPath
      }
    }
  }
})

// Third guard: Checks access to the target route, then stores the access state and accepted
// universes for revalidation before navigation is confirmed.
router.beforeEach(async (to) => {
  // Read before the check, as the check reads them: if they change before the navigation is
  // confirmed, it is checked again.
  const state = accessState(to)
  let universes: AccessRights['universes'] = []

  if (to.meta.restrictions) {
    const access = await checkRouteAccess(to).catch(() => undefined)
    if (!access) {
      // The user had access to the page, and lost it: home, at the top, rather than the not found
      // page. Only the check of the displayed page again leads here, vue-router stopping any other
      // navigation there as a duplicate.
      const displayed = router.currentRoute.value
      if (
        displayed !== START_LOCATION
        && to.name === displayed.name
        && to.fullPath === displayed.fullPath
      ) {
        const { path, query, hash } = router.resolve(useCurrentUserSession().homeRoute.value)

        return {
          path,
          query,
          hash,
          state: {
            preserveScroll: false
          }
        }
      }

      // The not found page, at the address of the page, does not reveal that the page exists.
      return {
        name: NOT_FOUND_ROUTE_NAME,
        params: {
          pathMatch: to.path.substring(1).split('/').map((segment) => {
            try {
              return decodeURIComponent(segment)
            }
            catch {
              return segment
            }
          })
        },
        query: to.query,
        hash: to.hash,
      }
    }

    universes = access.universes
  }

  navigationChecks.set(to, { state, universes })
})

// Fourth guard: Rechecks access if the relevant state changed while the navigation was in
// progress.
router.beforeResolve((to) => {
  const check = navigationChecks.get(to)
  if (check && check.state !== accessState(to)) {
    return {
      path: to.path,
      query: to.query,
      hash: to.hash
    }
  }
})

// Fifth and last guard: Clears the pending navigation, switches universe if needed, and
// updates the page title.
router.afterEach((to, _from, failure) => {
  endNavigation(to)

  if (failure) {
    return
  }

  const accepted = navigationChecks.get(to)?.universes
  if (accepted?.length) {
    const { universes } = useCurrentUserSession()
    if (!accepted.includes(universes.active.value)) {
      universes.switch(accepted[0])
    }
  }

  document.title = `${to.meta.title ? `${to.meta.title} - ` : ''}${MAIN_TITLE}`
})

// A navigation ended by an error, a guard that throws or a page that fails to load, never
// reaches the afterEach: it ends here all the same. vue-router no longer logs the errors
// once a handler is registered: they are logged here.
router.onError((error, to) => {
  endNavigation(to)
  console.error(error)
})

export default router
