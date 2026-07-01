import type { AvRoute } from '@/common/types'
import { ROUTES } from '@/common/constants'

export const studentToolsKitRoute: AvRoute = {
  ...ROUTES.STUDENT.TOOLS_KIT,
  component: () => import('@/features/student/kit/views/StudentToolsKitView/StudentToolsKitView.vue')
}
