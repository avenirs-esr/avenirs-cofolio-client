import type { RouteRecordRaw } from 'vue-router'

export const TEACHER_HOME_ROUTE = 'teacher-home'

export const teacherHomeRoute = {
  path: '/',
  alias: '',
  name: 'teacher-home',
  component: () =>
    import('@/features/teacher/views/TeacherHomeView.vue'),
}

const routes: RouteRecordRaw[] = [
  teacherHomeRoute
]

export default routes
