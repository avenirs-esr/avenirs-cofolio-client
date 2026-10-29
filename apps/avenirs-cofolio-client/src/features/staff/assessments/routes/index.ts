import type { AvRoute } from '@/common/types'
import { ROUTES } from '@/common/constants'
import { BASE_BREADCRUMBS } from '@/common/constants/meta-breadcrumbs'

export const staffActivityAssessmentRoute: AvRoute = {
  ...ROUTES.STAFF.ACTIVITY_ASSESSMENT,
  props: route => ({
    declaredActivityId: route.params.declaredActivityId,
  }),
  component: () =>
    import('@/features/staff/assessments/views/ActivityAssessmentDetailsView/ActivityAssessmentDetailsView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STAFF.HOME.BASE]
  }
}

export const staffStudentTrackingAssessmentsRoute: AvRoute = {
  ...ROUTES.STAFF.STUDENT_TRACKING.ASSESSMENTS,
  component: () =>
    import('@/features/staff/assessments/views/AssessmentsView/AssessmentsView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STAFF.STUDENT_TRACKING.ASSESSMENTS]
  }
}

export const staffStudentTrackingAssessmentsRoutes: AvRoute[] = [
  staffStudentTrackingAssessmentsRoute,
]
