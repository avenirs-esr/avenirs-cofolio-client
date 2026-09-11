import type { AvRoute } from '@/common/types'
import { META_BREADCRUMBS } from '@/common/constants/meta-breadcrumbs'
import { ROUTES } from '@/common/constants/route-names'

export default []

export const projectActivitiesRoute: AvRoute = {
  ...ROUTES.STUDENT.PROJECT_ACTIVITIES,
  component: () => import('@/features/student/buildProject/views/ProjectActivitiesView/ProjectActivitiesView.vue'),
  meta: {
    breadcrumb: [
      META_BREADCRUMBS.STUDENT.HOME,
      META_BREADCRUMBS.STUDENT.PROJECT.DEFAULT,
      META_BREADCRUMBS.STUDENT.PROJECT.ACTIVITIES,
    ],
  }
}

export const projectActivitiesDetailedRoute: AvRoute = {
  ...ROUTES.STUDENT.PROJECT_ACTIVITIES_DETAILED,
  props: route => ({
    id: route.params.id,
  }),
  component: () =>
    import('@/features/student/buildProject/views/ProjectActivityDetailedView/ProjectActivityDetailedView.vue'),
  meta: {
    breadcrumb: [
      META_BREADCRUMBS.STUDENT.HOME,
      META_BREADCRUMBS.STUDENT.PROJECT.DEFAULT,
      META_BREADCRUMBS.STUDENT.PROJECT.ACTIVITIES,
    ],
  }
}

export const projectActivitiesCatalogRoute: AvRoute = {
  ...ROUTES.STUDENT.PROJECT_ACTIVITIES_CATALOG,
  props: route => ({
    thematic: route.params.thematic as string | undefined,
    id: route.params.id as string | undefined,
  }),
  component: () =>
    import('@/features/student/buildProject/views/ProjectActivitiesCatalogView/ProjectActivitiesCatalogView.vue'),
  meta: {
    breadcrumb: [
      META_BREADCRUMBS.STUDENT.HOME,
      META_BREADCRUMBS.STUDENT.PROJECT.DEFAULT,
      META_BREADCRUMBS.STUDENT.PROJECT.ACTIVITIES,
    ],
  }
}

export const projectTrajectoriesRoute: AvRoute = {
  ...ROUTES.STUDENT.PROJECT_TRAJECTORIES,
  component: () => import('@/features/student/global/views/StudentProjectTrajectoriesView/StudentProjectTrajectoriesView.vue'),
  meta: {
    breadcrumb: [
      META_BREADCRUMBS.STUDENT.HOME,
      META_BREADCRUMBS.STUDENT.PROJECT.DEFAULT,
      { textKey: META_BREADCRUMBS.STUDENT.PROJECT.BUILD_PROJECT.textKey },
    ]
  }
}

export const projectActivitiesRoutes = [
  projectActivitiesRoute,
  projectActivitiesCatalogRoute,
  projectActivitiesDetailedRoute,
]

export const projectTrajectoriesRoutes = [
  projectTrajectoriesRoute,
]

export const studentActivityRoute: AvRoute = {
  ...ROUTES.STUDENT.ACTIVITY,
  props: route => ({
    id: route.params.id as string | undefined,
  }),
  component: () =>
    import('@/features/student/buildProject/views/ProjectActivityDetailedView/ProjectActivityDetailedView.vue'),
  meta: {
    breadcrumb: [
      META_BREADCRUMBS.STUDENT.HOME,
      { textKey: META_BREADCRUMBS.STUDENT.PROJECT.ACTIVITIES.textKey },
    ],
  }
}

export const studentActivitiesCatalogRoute: AvRoute = {
  ...ROUTES.STUDENT.ACTIVITIES_CATALOG,
  props: route => ({
    thematic: route.params.thematic as string | undefined,
    id: route.params.id as string | undefined,
  }),
  component: () =>
    import('@/features/student/buildProject/views/ProjectActivitiesCatalogView/ProjectActivitiesCatalogView.vue'),
  meta: {
    breadcrumb: [
      META_BREADCRUMBS.STUDENT.HOME,
      { textKey: META_BREADCRUMBS.STUDENT.PROJECT.ACTIVITIES.textKey },
    ],
  }
}
