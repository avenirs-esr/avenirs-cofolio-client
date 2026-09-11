import type { EActivityStatus } from '@/api/avenir-esr'
import type { AvRoute } from '@/common/types'
import { ROUTES } from '@/common/constants'
import { META_BREADCRUMBS } from '@/common/constants/meta-breadcrumbs'

export const staffActivitiesRoute: AvRoute = {
  ...ROUTES.STAFF.ACTIVITIES,
  component: () =>
    import('@/features/staff/activities/views/ActivitiesView/ActivitiesView.vue'),
  meta: {
    breadcrumb: [
      META_BREADCRUMBS.STAFF.HOME,
      META_BREADCRUMBS.STAFF.ACTIVITIES.DEFAULT
    ]
  }
}

export const staffActivitiesEditNationalActivityRoute: AvRoute = {
  ...ROUTES.STAFF.ACTIVITIES_EDIT_NATIONAL_ACTIVITY,
  props: route => ({
    id: route.params.id,
  }),
  component: () =>
    import('@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityView.vue'),
  meta: {
    breadcrumb: [
      META_BREADCRUMBS.STAFF.HOME,
      META_BREADCRUMBS.STAFF.ACTIVITIES.DEFAULT
    ]
  }
}

export const staffActivityCatalogRoute: AvRoute = {
  ...ROUTES.STAFF.ACTIVITY_CATALOG,
  props: route => ({
    status: route.params.status as EActivityStatus,
    id: route.params.id,
  }),
  component: () =>
    import('@/features/staff/activities/views/NationalActivityCatalogView/NationalActivityCatalogView.vue'),
  meta: {
    breadcrumb: [
      META_BREADCRUMBS.STAFF.HOME,
      META_BREADCRUMBS.STAFF.ACTIVITIES.DEFAULT
    ]
  }
}

export const staffActivitiesRoutes: AvRoute[] = [
  staffActivitiesRoute,
  staffActivitiesEditNationalActivityRoute,
  staffActivityCatalogRoute
]
