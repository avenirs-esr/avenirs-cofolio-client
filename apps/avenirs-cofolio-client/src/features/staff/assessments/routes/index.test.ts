import { testRoute } from 'tests/utils'
import { ROUTES } from '@/common/constants'
import {
  staffActivityAssessmentRoute,
  staffStudentTrackingAssessmentsRoute,
} from '@/features/staff/assessments/routes'
import ActivityAssessmentDetailsView from '@/features/staff/assessments/views/ActivityAssessmentDetailsView/ActivityAssessmentDetailsView.vue'
import AssessmentsView from '@/features/staff/assessments/views/AssessmentsView/AssessmentsView.vue'

testRoute(
  staffActivityAssessmentRoute,
  ROUTES.STAFF.ACTIVITY_ASSESSMENT,
  ActivityAssessmentDetailsView
)

testRoute(
  staffStudentTrackingAssessmentsRoute,
  ROUTES.STAFF.STUDENT_TRACKING.ASSESSMENTS,
  AssessmentsView
)
