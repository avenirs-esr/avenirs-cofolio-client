import type { AvRoute } from '@/common/types/router.types'
import { ROUTES } from '@/common/constants'
import { BASE_BREADCRUMBS } from '@/common/constants/meta-breadcrumbs'

export const studentProjectSkillsRoute: AvRoute = {
  ...ROUTES.STUDENT.PROJECT_SKILLS,
  component: () => import('@/features/student/skills/views/StudentProjectSkillsView/StudentProjectSkillsView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STUDENT.PROJECT.SKILLS]
  }
}
