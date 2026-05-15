import type { AvRoute } from '@/common/types'
import { ROUTES } from '@/common/constants'

export const staffActivitiesRoute: AvRoute = {
  ...ROUTES.STAFF.ACTIVITIES,
  component: () =>
    import('@/features/staff/activities/views/ActivitiesView/ActivitiesView.vue'),
}

export const staffActivitiesEditNationalActivityRoute: AvRoute = {
  ...ROUTES.STAFF.ACTIVITIES_EDIT_NATIONAL_ACTIVITY,
  props: route => ({
    id: route.params.id,
  }),
  component: () =>
    import('@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityView.vue'),
}

export const staffActivityDetailsRoute: AvRoute = {
  ...ROUTES.STAFF.ACTIVITY_DETAILS,
  // TODO: us #1493 update component to load when #1493 is merged
  component: () =>
    import('@/features/staff/activities/views/ActivitiesView/ActivitiesView.vue'),
}
