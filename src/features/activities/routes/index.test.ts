import { ROUTES } from '@/common/constants'
import { staffActivitiesEditNationalActivityRoute, staffActivitiesRoute, staffActivityCatalogRoute, staffActivityFeedbacksRoute } from '@/features/activities/routes'
import ActivitiesView from '@/features/activities/views/ActivitiesView/ActivitiesView.vue'
import EditNationalActivityView from '@/features/activities/views/EditNationalActivityView/EditNationalActivityView.vue'
import NationalActivityCatalogView from '@/features/activities/views/NationalActivityCatalogView/NationalActivityCatalogView.vue'
import ActivityFeedbacksView from '@/features/feedbacks/views/ActivityFeedbacksView/ActivityFeedbacksView.vue'
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
  staffActivityFeedbacksRoute,
  ROUTES.STAFF.ACTIVITY_FEEDBACKS,
  ActivityFeedbacksView
)
