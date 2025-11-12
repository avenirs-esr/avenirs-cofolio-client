import type { AvRoute } from '@/common/types/router.types'
import { ROUTE_NAMES } from '@/common/constants'

export const studentAmsRoute: AvRoute = {
  ...ROUTE_NAMES.STUDENT.ACTIVITY,
  component: () => import('@/features/student/ams/views/StudentAmsView/StudentAmsView.vue')
}

export const studentEducationAmsRoute: AvRoute = {
  ...ROUTE_NAMES.STUDENT.EDUCATION_ACTIVITIES,
  component: () => import('@/features/student/ams/views/StudentEducationAmsView/StudentEducationAmsView.vue')
}
