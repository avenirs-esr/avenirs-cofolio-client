import type { EUserCategory } from '@/api/avenir-esr'
import { createRouter, createWebHistory } from 'vue-router'
import { resolveCguRedirect } from '@/features/auth/global/guards/cgu.guard'
import authRoutes from '@/features/auth/global/routes'
import staffRoutes from '@/features/staff/global/routes'
import studentRoutes from '@/features/student/global/routes'

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
    props: {
      titleKey: 'global.views.notFoundView.pageNotFound.title',
      descriptionKey: 'global.views.notFoundView.pageNotFound.description'
    },
  },
]

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
  if (to.meta.public !== true) {
    const { useAuthStore } = await import('@/features/auth/global/stores/auth.store')
    const { ensureAuthenticated } = useAuthStore()
    const toAuth = await ensureAuthenticated({ to, delegated: true })
    if (toAuth !== undefined) {
      return toAuth
    }

    const { useCurrentUser } = await import('@/features/auth/global/composables/use-current-user/use-current-user')
    const { categories, homeRoute, hasAcceptedLatestCgu } = useCurrentUser()

    if (to.name === 'home') {
      return homeRoute.value
    }

    const allowedCategories = to.meta.roles as EUserCategory[] | undefined
    if (!__ENABLE_MSW__ && allowedCategories !== undefined && !allowedCategories.some(allowedCategory => categories.value.includes(allowedCategory))) {
      return homeRoute.value
    }

    const cguRedirect = resolveCguRedirect(to, hasAcceptedLatestCgu.value)
    if (cguRedirect !== undefined) {
      return cguRedirect
    }
  }

  const specificTitle = to.meta.title ? `${to.meta.title} - ` : ''
  document.title = `${specificTitle}${MAIN_TITLE}`
})

export default router
