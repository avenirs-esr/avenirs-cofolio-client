import type { AvRoute } from '@/common/types'
import { ROUTES } from '@/common/constants'

export const staffActivitiesRoute: AvRoute = {
  ...ROUTES.STAFF.ACTIVITIES,
  component: () =>
    import('@/features/staff/activities/views/ActivitiesView/ActivitiesView.vue'),
}

export const staffActivitiesAddNationalActivityRoute: AvRoute = {
  ...ROUTES.STAFF.ACTIVITIES_ADD_NATIONAL_ACTIVITY,
  component: () =>
    import('@/features/staff/activities/views/AddNationalActivityView/AddNationalActivityView.vue'),
}
