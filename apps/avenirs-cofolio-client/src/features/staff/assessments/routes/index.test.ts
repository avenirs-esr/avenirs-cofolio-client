import { testRoute } from 'tests/utils'
import { ROUTES } from '@/common/constants'
import { staffActivityAssessmentRoute } from '@/features/staff/assessments/routes'
import ActivityAssessmentDetailsView from '@/features/staff/assessments/views/ActivityAssessmentDetailsView/ActivityAssessmentDetailsView.vue'

testRoute(
  staffActivityAssessmentRoute,
  ROUTES.STAFF.ACTIVITY_ASSESSMENT,
  ActivityAssessmentDetailsView
)
