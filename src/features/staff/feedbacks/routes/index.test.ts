import { ROUTES } from '@/common/constants'
import { staffStudentActivityFeedbacksRoute, staffStudentFeedbacksRoute } from '@/features/staff/feedbacks/routes'
import ActivityFeedbacksView from '@/features/staff/feedbacks/views/ActivityFeedbacksView/ActivityFeedbacksView.vue'
import FeedbacksView from '@/features/staff/feedbacks/views/FeedbacksView/FeedbacksView.vue'
import { testRoute } from 'tests/utils'

testRoute(
  staffStudentActivityFeedbacksRoute,
  ROUTES.STAFF.ACTIVITY_FEEDBACKS,
  ActivityFeedbacksView
)

testRoute(
  staffStudentFeedbacksRoute,
  ROUTES.STAFF.STUDENT_FEEDBACKS,
  FeedbacksView
)
