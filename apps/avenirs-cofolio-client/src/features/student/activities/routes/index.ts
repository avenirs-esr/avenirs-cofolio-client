import type { AvRoute } from '@/common/types'
import { BASE_BREADCRUMBS } from '@/common/constants/meta-breadcrumbs'
import { ROUTES } from '@/common/constants/route-names'

export default []

export const studentActivityRoute: AvRoute = {
  ...ROUTES.STUDENT.ACTIVITY,
  props: route => ({
    id: route.params.id as string | undefined,
  }),
  component: () => import('@/features/student/activities/views/ActivityView/ActivityView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STUDENT.ACTIVITIES],
  }
}

export const studentActivitiesRoute: AvRoute = {
  ...ROUTES.STUDENT.ACTIVITIES,
  component: () => import('@/features/student/activities/views/ActivitiesView/ActivitiesView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STUDENT.ACTIVITIES],
  }
}

export const studentActivitiesCatalogRoute: AvRoute = {
  ...ROUTES.STUDENT.ACTIVITIES_CATALOG,
  props: route => ({
    thematic: route.params.thematic as string | undefined,
    id: route.params.id as string | undefined,
  }),
  component: () => import('@/features/student/activities/views/ActivitiesCatalogView/ActivitiesCatalogView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STUDENT.ACTIVITIES],
  }
}

export const studentWidgetActivityRoute: AvRoute = {
  ...ROUTES.STUDENT.WIDGET_ACTIVITY,
  props: route => ({
    id: route.params.id as string | undefined,
  }),
  component: () => import('@/features/student/activities/views/ActivityView/ActivityView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STUDENT.WIDGETS.ACTIVITIES],
  }
}

export const studentWidgetActivityCatalogRoute: AvRoute = {
  ...ROUTES.STUDENT.WIDGET_ACTIVITY_CATALOG,
  props: route => ({
    thematic: route.params.thematic as string | undefined,
    id: route.params.id as string | undefined,
    widget: true,
  }),
  component: () => import('@/features/student/activities/views/ActivitiesCatalogView/ActivitiesCatalogView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STUDENT.WIDGETS.ACTIVITIES],
  }
}

export const studentActivitiesRoutes = [
  studentActivityRoute,
  studentActivitiesRoute,
  studentActivitiesCatalogRoute,
  studentWidgetActivityRoute,
  studentWidgetActivityCatalogRoute,
]
