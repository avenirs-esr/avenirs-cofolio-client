import type { AvRoute } from '@/common/types'
import { ROUTES } from '@/common/constants/route-names'

export default []

export const projectActivitiesRoute: AvRoute = {
  ...ROUTES.STUDENT.PROJECT_ACTIVITIES,
  component: () => import('@/features/student/buildProject/views/ProjectActivitiesView/ProjectActivitiesView.vue'),
}

export const projectActivitiesDetailedRoute: AvRoute = {
  ...ROUTES.STUDENT.PROJECT_ACTIVITIES_DETAILED,
  props: route => ({
    id: route.params.id,
  }),
  component: () =>
    import('@/features/student/buildProject/views/ProjectActivityDetailedView/ProjectActivityDetailedView.vue'),
}

export const projectActivitiesCatalogRoute: AvRoute = {
  ...ROUTES.STUDENT.PROJECT_ACTIVITIES_CATALOG,
  props: route => ({
    thematic: route.params.thematic as string | undefined,
    id: route.params.id as string | undefined,
  }),
  component: () =>
    import('@/features/student/buildProject/views/ProjectActivitiesCatalogView/ProjectActivitiesCatalogView.vue'),
}

export const projectTrajectoriesRoute: AvRoute = {
  ...ROUTES.STUDENT.PROJECT_TRAJECTORIES,
  component: () => import('@/features/student/global/views/StudentProjectTrajectoriesView/StudentProjectTrajectoriesView.vue'),
}

export const projectActivitiesRoutes = [
  projectActivitiesRoute,
  projectActivitiesCatalogRoute,
  projectActivitiesDetailedRoute,
]

export const projectTrajectoriesRoutes = [
  projectTrajectoriesRoute,
]

export const studentActivitiesCatalogRoute: AvRoute = {
  ...ROUTES.STUDENT.ACTIVITIES_CATALOG,
  props: route => ({
    thematic: route.params.thematic as string | undefined,
    id: route.params.id as string | undefined,
  }),
  component: () =>
    import('@/features/student/buildProject/views/ProjectActivitiesCatalogView/ProjectActivitiesCatalogView.vue'),
}
