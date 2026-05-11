import { ROUTES } from '@/common/constants'
import { staffActivitiesEditNationalActivityRoute, staffActivitiesRoute, staffActivityDetailsRoute } from '@/features/staff/activities/routes'
import ActivitiesView from '@/features/staff/activities/views/ActivitiesView/ActivitiesView.vue'
import EditNationalActivityView from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityView.vue'
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
  staffActivityDetailsRoute,
  ROUTES.STAFF.ACTIVITY_DETAILS,
  // TODO: us #1493 update the rendered component
  ActivitiesView
)
