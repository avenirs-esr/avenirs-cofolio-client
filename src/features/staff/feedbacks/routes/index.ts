import type { AvRoute } from '@/common/types'
import { ROUTES } from '@/common/constants'

export const staffStudentActivityFeedbacksRoute: AvRoute = {
  ...ROUTES.STAFF.ACTIVITY_FEEDBACK_DETAILS,
  props: route => ({
    feedbackId: route.params.feedbackId,
  }),
  component: () =>
    import('@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/ActivityFeedbackDetailsView.vue'),
}

export const staffStudentFeedbacksRoute: AvRoute = {
  ...ROUTES.STAFF.STUDENT_FEEDBACKS,
  component: () =>
    import('@/features/staff/feedbacks/views/FeedbacksView/FeedbacksView.vue'),
}

export const staffFeedbacksRoutes: AvRoute[] = [
  staffStudentActivityFeedbacksRoute,
  staffStudentFeedbacksRoute,
]
