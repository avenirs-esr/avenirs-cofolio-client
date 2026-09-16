import type { AvRoute } from '@/common/types/router.types'
import { ROUTES } from '@/common/constants'
import { BASE_BREADCRUMBS } from '@/common/constants/meta-breadcrumbs'

export const studentSkillsRoute: AvRoute = {
  ...ROUTES.STUDENT.SKILLS,
  component: () => import('@/features/student/skills/views/StudentProjectSkillsView/StudentProjectSkillsView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STUDENT.SKILLS]
  }
}
