import type { AvRoute } from '@/common/types'
import { BASE_BREADCRUMBS } from '@/common/constants/meta-breadcrumbs'
import { ROUTES } from '@/common/constants/route-names'

export default []

export const projectTrajectoriesRoute: AvRoute = {
  ...ROUTES.STUDENT.PROJECT_TRAJECTORIES,
  component: () => import('@/features/student/global/views/StudentProjectTrajectoriesView/StudentProjectTrajectoriesView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STUDENT.PROJECT.BUILD_PROJECT.BUILD_PROJECT]
  }
}

export const projectTrajectoriesRoutes = [
  projectTrajectoriesRoute,
]
