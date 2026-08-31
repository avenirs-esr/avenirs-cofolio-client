import type { EActivityStatus } from '@/api/avenir-esr'
import type { AvRoute } from '@/common/types'
import { ROUTES } from '@/common/constants'

export const staffActivitiesRoute: AvRoute = {
  ...ROUTES.STAFF.ACTIVITIES,
  component: () =>
    import('@/features/activities/views/ActivitiesView/ActivitiesView.vue'),
}

export const staffActivitiesEditNationalActivityRoute: AvRoute = {
  ...ROUTES.STAFF.ACTIVITIES_EDIT_NATIONAL_ACTIVITY,
  props: route => ({
    id: route.params.id,
  }),
  component: () =>
    import('@/features/activities/views/EditNationalActivityView/EditNationalActivityView.vue'),
}

export const staffActivityCatalogRoute: AvRoute = {
  ...ROUTES.STAFF.ACTIVITY_CATALOG,
  props: route => ({
    status: route.params.status as EActivityStatus,
    id: route.params.id,
  }),
  component: () =>
    import('@/features/activities/views/NationalActivityCatalogView/NationalActivityCatalogView.vue'),
}

export const staffActivityFeedbacksRoute: AvRoute = {
  ...ROUTES.STAFF.ACTIVITY_FEEDBACKS,
  props: route => ({
    activityId: route.params.id,
  }),
  component: () =>
    import('@/features/feedbacks/views/ActivityFeedbacksView/ActivityFeedbacksView.vue'),
}

export const staffActivitiesRoutes: AvRoute[] = [
  staffActivitiesRoute,
  staffActivitiesEditNationalActivityRoute,
  staffActivityCatalogRoute,
  staffActivityFeedbacksRoute
]
