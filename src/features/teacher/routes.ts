import type { RouteRecordRaw } from 'vue-router'

export const TEACHER_HOME_ROUTE = 'teacher-home'

const routes: RouteRecordRaw[] = [
  {
    path: '/teacher',
    component: () => import('@/layouts/teacher/TeacherLayout.vue'),
    children: [
      {
        path: '',
        name: TEACHER_HOME_ROUTE,
        component: () =>
          import('@/features/teacher/views/TeacherHomeView.vue'),
      },
    ],
  },
]

export default routes
