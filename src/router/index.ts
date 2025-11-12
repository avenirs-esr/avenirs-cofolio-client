import { ROUTE_NAMES } from '@/common/constants'
import studentRoutes from '@/features/student/routes'
import teacherRoutes from '@/features/teacher/routes'
import { createRouter, createWebHistory } from 'vue-router'

const MAIN_TITLE = 'Cofolio'

const routes = [
  ...studentRoutes,
  ...teacherRoutes,
  {
    path: '/',
    redirect: {
      name: ROUTE_NAMES.STUDENT.HOME.name
    },
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
