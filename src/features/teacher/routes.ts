import type { RouteRecordRaw } from 'vue-router'

export const TEACHER_HOME_ROUTE = 'teacher-home'

export const teacherHomeRoute = {
  path: '',
  name: 'teacher-home',
  component: () =>
    import('@/features/teacher/views/TeacherHomeView/TeacherHomeView.vue'),
}

const routes: RouteRecordRaw[] = [
  {
    path: '/teacher',
    component: () => import('@/features/teacher/layouts/TeacherLayout/TeacherLayout.vue'),
    children: [
      teacherHomeRoute
    ]
  }
]

export default routes
