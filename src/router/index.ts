import type { EUserCategory } from '@/api/avenir-esr'
import { createRouter, createWebHistory } from 'vue-router'
import { ROUTES } from '@/common/constants'
import { useCurrentUserSession } from '@/features/auth/global/composables/use-current-user-session/use-current-user-session'
import { resolveCguRedirect } from '@/features/auth/global/guards/cgu.guard'
import authRoutes from '@/features/auth/global/routes'
import { useAuthStore } from '@/features/auth/global/stores/auth.store'
import staffRoutes from '@/features/staff/global/routes'
import studentRoutes from '@/features/student/global/routes'
import { validateRoutes } from '@/router/validations/validate-routes'

const MAIN_TITLE = 'Cofolio'

const routes = [
  ...authRoutes,
  ...studentRoutes,
  ...staffRoutes,
  {
    path: '/',
    name: 'home',
    component: { render: () => null },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/common/views/NotFoundView/NotFoundView.vue'),
  },
]

if (import.meta.env?.DEV) {
  validateRoutes(routes, 'home', 'NotFound')
}

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

router.beforeEach(async (to, from) => { // Cf. https://github.com/vueuse/head pour des transformations avancées de Head
  const { ensureSession, isLoggedIn } = useAuthStore()

  if (to.name === ROUTES.AUTH.LOGIN.name && isLoggedIn) {
    const redirect = to.query.redirect

    if (typeof redirect === 'string' && redirect.startsWith('/') && router.resolve(redirect).name !== ROUTES.AUTH.LOGIN.name) {
      return redirect
    }

    const { homeRoute } = useCurrentUserSession()

    return homeRoute.value
  }

  if (to.meta.public !== true) {
    const toAuth = await ensureSession(to.fullPath)

    if (toAuth !== undefined) {
      return toAuth
    }

    const { categories, profile, homeRoute, cgu } = useCurrentUserSession()

    if (to.name === 'home') {
      return homeRoute.value
    }

    const allowedCategories = (to.meta.roles ?? []) as EUserCategory[]

    // No roles declared: open to every authenticated user. Only the routes passed to validateRoutes()
    // may do so (home, NotFound): in development, any other route without roles throws at startup.
    if (allowedCategories.length) {
      const accessibleCategories = categories.value.filter(category => allowedCategories.includes(category))

      if (!accessibleCategories.length) {
        return from.matched.length && from.name !== ROUTES.AUTH.LOGIN.name
          ? false
          : homeRoute.value
      }

      if (!accessibleCategories.includes(profile.activeCategory.value)) {
        profile.switch(accessibleCategories[0])
      }
    }

    const cguRedirect = resolveCguRedirect(to, cgu.hasAcceptedLatest.value)
    if (cguRedirect !== undefined) {
      return cguRedirect
    }
  }

  const specificTitle = to.meta.title ? `${to.meta.title} - ` : ''
  document.title = `${specificTitle}${MAIN_TITLE}`
})

export default router
