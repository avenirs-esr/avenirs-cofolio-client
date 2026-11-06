import type { AvRoute } from '@avenirs-esr/shared'
import { BASE_BREADCRUMBS } from '@/common/constants/meta-breadcrumbs'
import { ROUTES } from '@/common/constants/route-names'

export default []

export const projectBuildProjectRoute: AvRoute = {
  ...ROUTES.STUDENT.BUILD_PROJECT,
  component: () => import('@/features/student/global/views/StudentBuildProjectView/StudentBuildProjectView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STUDENT.PROJECT.LIFE_PROJECT.BUILD_PROJECT]
  }
}

export const projectBuildProjectRoutes = [
  projectBuildProjectRoute,
]
