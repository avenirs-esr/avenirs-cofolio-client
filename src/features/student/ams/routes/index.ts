import type { AvRoute } from '@/common/types/router.types'
import { ROUTES } from '@/common/constants'

export const studentAmsRoute: AvRoute = {
  ...ROUTES.STUDENT.ACTIVITY,
  component: () => import('@/features/student/ams/views/StudentAmsView/StudentAmsView.vue')
}

export const studentEducationAmsRoute: AvRoute = {
  ...ROUTES.STUDENT.EDUCATION_ACTIVITIES,
  component: () => import('@/features/student/ams/views/StudentEducationAmsView/StudentEducationAmsView.vue')
}
