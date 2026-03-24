import { ROUTES } from '@/common/constants'
import studentRoutes from '@/features/student/global/routes'
import teacherRoutes from '@/features/teacher/global/routes'
import { createRouter, createWebHistory } from 'vue-router'

const MAIN_TITLE = 'Cofolio'

const routes = [
  ...studentRoutes,
  ...teacherRoutes,
  {
    path: '/',
    redirect: {
      name: ROUTES.STUDENT.HOME.name
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/common/views/NotFoundView/NotFoundView.vue'),
    props: {
      title: 'global.views.notFoundView.pageNotFound.title',
      description: 'global.views.notFoundView.pageNotFound.description'
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env?.BASE_URL || ''),
  routes,
  scrollBehavior: () => {
    return { top: 0 }
  }
})

router.beforeEach((to) => { // Cf. https://github.com/vueuse/head pour des transformations avancées de Head
  const specificTitle = to.meta.title ? `${to.meta.title} - ` : ''
  document.title = `${specificTitle}${MAIN_TITLE}`
})

export default router
