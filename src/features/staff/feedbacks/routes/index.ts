import type { AvRoute } from '@/common/types'
import { ROUTES } from '@/common/constants'
import { META_BREADCRUMBS } from '@/common/constants/meta-breadcrumbs'

export const staffActivityFeedbacksRoute: AvRoute = {
  ...ROUTES.STAFF.ACTIVITY_FEEDBACK,
  props: route => ({
    feedbackId: route.params.feedbackId,
  }),
  component: () =>
    import('@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/ActivityFeedbackDetailsView.vue'),
  meta: {
    breadcrumb: [
      META_BREADCRUMBS.STAFF.HOME,
      { textKey: META_BREADCRUMBS.STAFF.STUDENT_TRACKING.FEEDBACKS.textKey },
    ]
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
    breadcrumb: [
      META_BREADCRUMBS.STAFF.HOME,
      META_BREADCRUMBS.STAFF.STUDENT_TRACKING.DEFAULT,
      META_BREADCRUMBS.STAFF.STUDENT_TRACKING.FEEDBACKS,
    ]
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
    breadcrumb: [
      META_BREADCRUMBS.STAFF.HOME,
      META_BREADCRUMBS.STAFF.STUDENT_TRACKING.DEFAULT,
      { textKey: META_BREADCRUMBS.STAFF.STUDENT_TRACKING.FEEDBACKS.textKey },
    ]
  }
}

export const staffStudentTrackingFeedbacksRoutes: AvRoute[] = [
  staffStudentTrackingActivityFeedbacksRoute,
  staffStudentTrackingFeedbacksRoute,
]
