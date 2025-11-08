import studentRoutes, { studentHomeRoute } from '@/features/student/routes'
import { routes as teacherRoutes } from '@/features/teacher'
import { createRouter, createWebHistory } from 'vue-router'

const MAIN_TITLE = 'Cofolio'

const routes = [
  ...studentRoutes,
  ...teacherRoutes,
  {
    path: '/',
    redirect: studentHomeRoute,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env?.BASE_URL || ''),
  routes,
})

router.beforeEach((to) => { // Cf. https://github.com/vueuse/head pour des transformations avancées de Head
  const specificTitle = to.meta.title ? `${to.meta.title} - ` : ''
  document.title = `${specificTitle}${MAIN_TITLE}`
})

export default router
