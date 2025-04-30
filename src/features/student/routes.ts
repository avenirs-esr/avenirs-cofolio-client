import type { RouteRecordRaw } from 'vue-router'

export const STUDENT_HOME_ROUTE = 'student-home'
export const STUDENT_ABOUT_ROUTE = 'student-about'

const routes: RouteRecordRaw[] = [
  {
    path: '/student',
    component: () => import('@/features/student/layouts/StudentLayout.vue'),
    children: [
      {
        path: '',
        name: STUDENT_HOME_ROUTE,
        component: () =>
          import('@/features/student/views/StudentHomeView.vue'),
      },
      {
        path: 'about',
        name: STUDENT_ABOUT_ROUTE,
        component: () =>
          import('@/features/student/views/StudentAboutView.vue'),
      },
    ],
  },
]

export default routes
