import type { AvRoute } from '@/common/types'
import { ROUTES } from '@/common/constants'
import { BASE_BREADCRUMBS } from '@/common/constants/meta-breadcrumbs'

export const studentToolsKitRoute: AvRoute = {
  ...ROUTES.STUDENT.TOOLS_KIT,
  component: () => import('@/features/student/kit/views/StudentToolsKitView/StudentToolsKitView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STUDENT.TOOLS.KIT]
  }
}
