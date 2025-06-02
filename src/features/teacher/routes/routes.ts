import type TeacherLayout from '@/features/teacher/layouts/TeacherLayout/TeacherLayout.vue'
import type TeacherHomeView from '@/features/teacher/views/TeacherHomeView/TeacherHomeView.vue'
import type { RouteRecordRaw } from 'vue-router'

export const teacherHomeRoute = {
  path: '',
  name: 'teacher-home',
  component: () =>
    import('@/features/teacher/views/TeacherHomeView/TeacherHomeView.vue') as Promise<{
      default: typeof TeacherHomeView
    }>,
}

const routes: RouteRecordRaw[] = [
  {
    path: '/teacher',
    component: () => import('@/features/teacher/layouts/TeacherLayout/TeacherLayout.vue') as Promise<{
      default: typeof TeacherLayout
    }>,
    children: [
      teacherHomeRoute
    ]
  }
]

export default routes
