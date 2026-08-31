import type { EUserCategory } from '@/api/avenir-esr'
import authRoutes from '@/features/auth/routes'
import staffRoutes from '@/features/global/routes'
import studentRoutes from '@/features/global/routes'
import { createRouter, createWebHistory } from 'vue-router'

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
  const restrictions = [
    'public',
    'requireRole',
    'requireRoles',
    'requireAnyRole',
    'requirePermission',
    'requirePermissions',
    'requireAnyPermission'
  ].filter(restriction => restriction in to.meta)

  if (restrictions.length === 0) {
    //throw Error
  }
  
  

  if (to.meta.public !== true) {
    const { useAuthStore } = await import('@/features/auth/stores/auth.store')
    const authStore = useAuthStore()
    const toAuth = await authStore.ensureAuthenticated({ to, delegated: true })
    if (toAuth !== undefined) {
      return toAuth
    }

    if (to.name === 'home') {
      return authStore.homeRoute
    }

    const allowedCategories = to.meta.roles as EUserCategory[] | undefined
    if (!__ENABLE_MSW__ && allowedCategories !== undefined && !allowedCategories.some(allowedCategory => authStore.categories.includes(allowedCategory))) {
      return authStore.homeRoute
    }
  }

  const specificTitle = to.meta.title ? `${to.meta.title} - ` : ''
  document.title = `${specificTitle}${MAIN_TITLE}`
})

export default router
