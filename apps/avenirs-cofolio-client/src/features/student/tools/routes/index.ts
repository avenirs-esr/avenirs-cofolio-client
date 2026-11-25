import type { AvRoute } from '@avenirs-esr/shared'
import { ROUTES } from '@/common/constants'
import { BASE_BREADCRUMBS } from '@/common/constants/meta-breadcrumbs'

export const studentToolsToolsRoute: AvRoute = {
  ...ROUTES.STUDENT.TOOLS_TOOLS,
  component: () => import('@/features/student/tools/views/LearnerToolsView/LearnerToolsView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STUDENT.TOOLS.TOOLS],
  },
}

export const studentToolsToolsRoutes: AvRoute[] = [
  studentToolsToolsRoute,
]
