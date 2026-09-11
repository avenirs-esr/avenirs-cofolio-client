import type { AvRoute } from '@/common/types'
import { ROUTES } from '@/common/constants'
import { META_BREADCRUMBS } from '@/common/constants/meta-breadcrumbs'

export const studentToolsKitRoute: AvRoute = {
  ...ROUTES.STUDENT.TOOLS_KIT,
  component: () => import('@/features/student/kit/views/StudentToolsKitView/StudentToolsKitView.vue'),
  meta: {
    breadcrumb: [
      META_BREADCRUMBS.STUDENT.HOME,
      META_BREADCRUMBS.STUDENT.TOOLS.DEFAULT,
      META_BREADCRUMBS.STUDENT.TOOLS.KIT,
    ]
  }
}
