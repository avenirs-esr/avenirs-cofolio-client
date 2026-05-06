import { staffAddNationalActivityRoute } from '@/features/staff/activities/routes'
import AddNationalActivityView from '@/features/staff/activities/views/ActivitiesView/AddNationalActivityView.vue'
import { testRoute } from 'tests/utils'

testRoute(
  staffAddNationalActivityRoute,
  {
    path: 'trace/:id',
    name: 'student-trace',
  },
  AddNationalActivityView
)
