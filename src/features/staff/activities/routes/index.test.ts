import { staffActivitiesRoute } from '@/features/staff/activities/routes'
import ActivitiesView from '@/features/staff/activities/views/ActivitiesView/ActivitiesView.vue'
import { testRoute } from 'tests/utils'

testRoute(
  staffActivitiesRoute,
  {
    path: 'activities',
    name: 'staff-activities',
  },
  ActivitiesView
)
