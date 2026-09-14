import type { AvRoute } from '@/common/types'
import { ROUTES } from '@/common/constants'
import { BASE_BREADCRUMBS } from '@/common/constants/meta-breadcrumbs'

export const staffActivityFeedbacksRoute: AvRoute = {
  ...ROUTES.STAFF.ACTIVITY_FEEDBACK,
  props: route => ({
    feedbackId: route.params.feedbackId,
  }),
  component: () =>
    import('@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/ActivityFeedbackDetailsView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STAFF.HOME.FEEDBACKS]
  }
}

export const staffStudentTrackingActivityFeedbacksRoute: AvRoute = {
  ...ROUTES.STAFF.STUDENT_TRACKING.ACTIVITY_FEEDBACK,
  props: route => ({
    feedbackId: route.params.feedbackId,
  }),
  component: () =>
    import('@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/ActivityFeedbackDetailsView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STAFF.STUDENT_TRACKING.FEEDBACKS.BASE]
  }
}

export const staffStudentTrackingFeedbacksRoute: AvRoute = {
  ...ROUTES.STAFF.STUDENT_TRACKING.FEEDBACKS,
  props: route => ({
    activityId: route.query.activityId,
  }),
  component: () =>
    import('@/features/staff/feedbacks/views/FeedbacksView/FeedbacksView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STAFF.STUDENT_TRACKING.FEEDBACKS.WITHOUT_LINK]
  }
}

export const staffStudentTrackingFeedbacksRoutes: AvRoute[] = [
  staffStudentTrackingActivityFeedbacksRoute,
  staffStudentTrackingFeedbacksRoute,
]
