import type { AvRoute } from '@/common/types'
import { ROUTES } from '@/common/constants/route-names'

export default []

export const projectActivitiesRoute: AvRoute = {
  ...ROUTES.STUDENT.PROJECT_ACTIVITIES,
  component: () => import('@/features/student/buildProject/views/ProjectActivitiesView/ProjectActivitiesView.vue'),
}

export const projectActivitiesCatalogRoute: AvRoute = {
  ...ROUTES.STUDENT.PROJECT_ACTIVITIES_CATALOG,
  props: route => ({
    theme: route.params.theme,
    id: route.params.id
  }),
  component: () =>
    import('@/features/student/buildProject/views/ProjectActivitiesCatalogView/ProjectActivitiesCatalogView.vue'),
}
