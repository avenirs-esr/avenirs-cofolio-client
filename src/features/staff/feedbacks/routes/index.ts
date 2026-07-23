import type { AvRoute } from '@/common/types'
import { ROUTES } from '@/common/constants'

export const staffActivityFeedbacksRoute: AvRoute = {
  ...ROUTES.STAFF.ACTIVITY_FEEDBACK,
  props: route => ({
    feedbackId: route.params.feedbackId,
  }),
  component: () =>
    import('@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/ActivityFeedbackDetailsView.vue'),
}

export const staffStudentTrackingActivityFeedbacksRoute: AvRoute = {
  ...ROUTES.STAFF.STUDENT_TRACKING.ACTIVITY_FEEDBACK,
  props: route => ({
    feedbackId: route.params.feedbackId,
  }),
  component: () =>
    import('@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/ActivityFeedbackDetailsView.vue'),
}

export const staffStudentTrackingFeedbacksRoute: AvRoute = {
  ...ROUTES.STAFF.STUDENT_TRACKING.FEEDBACKS,
  component: () =>
    import('@/features/staff/feedbacks/views/FeedbacksView/FeedbacksView.vue'),
}

export const staffStudentTrackingFeedbacksRoutes: AvRoute[] = [
  staffStudentTrackingActivityFeedbacksRoute,
  staffStudentTrackingFeedbacksRoute,
]
