import { ROUTES } from '@/common/constants'
import { staffActivitiesAddNationalActivityRoute, staffActivitiesRoute, staffActivityDetailsRoute } from '@/features/staff/activities/routes'
import ActivitiesView from '@/features/staff/activities/views/ActivitiesView/ActivitiesView.vue'
import AddNationalActivityView from '@/features/staff/activities/views/AddNationalActivityView/AddNationalActivityView.vue'
import { testRoute } from 'tests/utils'

testRoute(
  staffActivitiesRoute,
  ROUTES.STAFF.ACTIVITIES,
  ActivitiesView
)

testRoute(
  staffActivitiesAddNationalActivityRoute,
  ROUTES.STAFF.ACTIVITIES_ADD_NATIONAL_ACTIVITY,
  AddNationalActivityView
)

testRoute(
  staffActivityDetailsRoute,
  ROUTES.STAFF.ACTIVITY_DETAILS,
  // TODO: us #1493 update the rendered component
  ActivitiesView
)
