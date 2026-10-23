import { createRouter, createWebHistory } from 'vue-router'
import { ROUTES } from '@/common/constants'
import { getRouteAccessRights } from '@/common/utils/route/access/route-access'
import { applyRouteRestrictions } from '@/common/utils/route/restrictions/route-restrictions'
import { useCurrentUserSession } from '@/features/auth/global/composables/use-current-user-session/use-current-user-session'
import { resolveCguRedirect } from '@/features/auth/global/guards/cgu.guard'
import authRoutes from '@/features/auth/global/routes'
import { useAuthStore } from '@/features/auth/global/stores/auth.store'
import staffRoutes from '@/features/staff/global/routes'
import studentRoutes from '@/features/student/global/routes'

const MAIN_TITLE = 'Cofolio'
const NOT_FOUND_ROUTE_NAME = 'NotFound'

const routes = applyRouteRestrictions(
  ...authRoutes,
  ...studentRoutes,
  ...staffRoutes,
  {
    path: '/',
    name: 'home',
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

router.beforeEach(async (to) => { // Cf. https://github.com/vueuse/head pour des transformations avancées de Head
  const { ensureSession, redirectToLogin, isLoggedIn } = useAuthStore()

  if (isLoggedIn) {
    const { homeRoute, cgu } = useCurrentUserSession()

    if (to.name === 'home') {
      return homeRoute.value
    }

    if (to.name === ROUTES.AUTH.LOGIN.name) {
      const redirect = to.query.redirect
      return typeof redirect === 'string' && redirect.startsWith('/') && router.resolve(redirect).name !== ROUTES.AUTH.LOGIN.name
        ? redirect
        : homeRoute.value
    }

    const cguRedirect = resolveCguRedirect(to, cgu.hasAcceptedLatest.value)
    if (cguRedirect !== undefined) {
      return cguRedirect
    }
  }
  else if (to.name === 'home') {
    return redirectToLogin(to.fullPath) ?? false
  }

  const restrictedTo = to.meta.restrictedTo
  if (restrictedTo) {
    const toAuth = await ensureSession(to.fullPath)
    if (toAuth !== undefined) {
      return toAuth
    }

    const { universes, cgu } = useCurrentUserSession()

    // ensureSession() may have just established the session, or replaced the restored one
    const cguRedirect = resolveCguRedirect(to, cgu.hasAcceptedLatest.value)
    if (cguRedirect !== undefined) {
      return cguRedirect
    }

    const access = getRouteAccessRights(restrictedTo)
    if (!access) {
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

    if (access.universes.length && !access.universes.includes(universes.active.value)) {
      universes.switch(access.universes[0])
    }
  }

  const specificTitle = to.meta.title ? `${to.meta.title} - ` : ''
  document.title = `${specificTitle}${MAIN_TITLE}`
})

export default router
