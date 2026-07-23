import { ROUTES } from '@/common/constants'
import {
  staffActivityFeedbacksRoute,
  staffStudentTrackingActivityFeedbacksRoute,
  staffStudentTrackingFeedbacksRoute
} from '@/features/staff/feedbacks/routes'
import ActivityFeedbackDetailsView from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/ActivityFeedbackDetailsView.vue'
import FeedbacksView from '@/features/staff/feedbacks/views/FeedbacksView/FeedbacksView.vue'
import { testRoute } from 'tests/utils'

testRoute(
  staffActivityFeedbacksRoute,
  ROUTES.STAFF.ACTIVITY_FEEDBACK,
  ActivityFeedbackDetailsView
)

testRoute(
  staffStudentTrackingActivityFeedbacksRoute,
  ROUTES.STAFF.STUDENT_TRACKING.ACTIVITY_FEEDBACK,
  ActivityFeedbackDetailsView
)

testRoute(
  staffStudentTrackingFeedbacksRoute,
  ROUTES.STAFF.STUDENT_TRACKING.FEEDBACKS,
  FeedbacksView
)
