import { ROUTES } from '@/common/constants'
import { staffStudentFeedbacksRoute } from '@/features/staff/feedbacks/routes'
import FeedbacksView from '@/features/staff/feedbacks/views/FeedbacksView/FeedbacksView.vue'
import { testRoute } from 'tests/utils'

testRoute(
  staffStudentFeedbacksRoute,
  ROUTES.STAFF.STUDENT_FEEDBACKS,
  FeedbacksView
)
