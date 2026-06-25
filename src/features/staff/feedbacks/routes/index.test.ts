import { ROUTES } from '@/common/constants'
import {
  staffStudentActivityFeedbacksRoute,
  staffStudentFeedbacksRoute
} from '@/features/staff/feedbacks/routes'
import ActivityFeedbackDetailsView from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/ActivityFeedbackDetailsView.vue'
import FeedbacksView from '@/features/staff/feedbacks/views/FeedbacksView/FeedbacksView.vue'
import { testRoute } from 'tests/utils'

testRoute(
  staffStudentActivityFeedbacksRoute,
  ROUTES.STAFF.ACTIVITY_FEEDBACK_DETAILS,
  ActivityFeedbackDetailsView
)

testRoute(
  staffStudentFeedbacksRoute,
  ROUTES.STAFF.STUDENT_FEEDBACKS,
  FeedbacksView
)
