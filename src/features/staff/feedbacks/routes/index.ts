import type { AvRoute } from '@/common/types'
import { ROUTES } from '@/common/constants'

export const staffStudentActivityFeedbacksRoute: AvRoute = {
  ...ROUTES.STAFF.ACTIVITY_FEEDBACKS,
  component: () =>
    import('@/features/staff/feedbacks/views/ActivityFeedbacksView/ActivityFeedbacksView.vue'),
}

export const staffStudentFeedbacksRoute: AvRoute = {
  ...ROUTES.STAFF.STUDENT_FEEDBACKS,
  props: route => ({
    activityId: route.params.activityId,
    feedbackId: route.params.feedbackId,
  }),
  component: () =>
    import('@/features/staff/feedbacks/views/FeedbacksView/FeedbacksView.vue'),
}
