import { ROUTES } from '@/common/constants'
import { staffActivitiesEditNationalActivityRoute, staffActivitiesRoute, staffActivityCatalogRoute } from '@/features/staff/activities/routes'
import ActivitiesView from '@/features/staff/activities/views/ActivitiesView/ActivitiesView.vue'
import EditNationalActivityView from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityView.vue'
import NationalActivityCatalogView from '@/features/staff/activities/views/NationalActivityCatalogView/NationalActivityCatalogView.vue'
import { testRoute } from 'tests/utils'

testRoute(
  staffActivitiesRoute,
  ROUTES.STAFF.ACTIVITIES,
  ActivitiesView
)

testRoute(
  staffActivitiesEditNationalActivityRoute,
  ROUTES.STAFF.ACTIVITIES_EDIT_NATIONAL_ACTIVITY,
  EditNationalActivityView
)

testRoute(
  staffActivityCatalogRoute,
  ROUTES.STAFF.ACTIVITY_CATALOG,
  NationalActivityCatalogView
)

testRoute(
  staffStudentFeedbacksRoute,
  ROUTES.STAFF.STUDENT_FEEDBACKS,
  FeedbacksView
)
