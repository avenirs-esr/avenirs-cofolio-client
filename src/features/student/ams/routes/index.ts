import type { AvRoute } from '@/common/types/router.types'
import type StudentAmsView from '@/features/student/ams/views/StudentAmsView/StudentAmsView.vue'
import type StudentEducationAmsView from '@/features/student/ams/views/StudentEducationAmsView/StudentEducationAmsView.vue'

export const studentAmsRoute: AvRoute = {
  path: 'activity/:id',
  name: 'student-activity',
  component: () => import('@/features/student/ams/views/StudentAmsView/StudentAmsView.vue') as Promise<{ default: typeof StudentAmsView }>
}

export const studentEducationAmsRoute: AvRoute = {
  path: 'education/activities',
  name: 'student-education-activities',
  component: () => import('@/features/student/ams/views/StudentEducationAmsView/StudentEducationAmsView.vue') as Promise<{ default: typeof StudentEducationAmsView }>
}
