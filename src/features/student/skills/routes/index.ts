import type { AvRoute } from '@/common/types/router.types'
import { ROUTES } from '@/common/constants'
import { META_BREADCRUMBS } from '@/common/constants/meta-breadcrumbs'

export const studentProjectSkillsRoute: AvRoute = {
  ...ROUTES.STUDENT.PROJECT_SKILLS,
  component: () => import('@/features/student/skills/views/StudentProjectSkillsView/StudentProjectSkillsView.vue'),
  meta: {
    breadcrumb: [
      META_BREADCRUMBS.STUDENT.HOME,
      META_BREADCRUMBS.STUDENT.PROJECT.DEFAULT,
      META_BREADCRUMBS.STUDENT.PROJECT.SKILLS,
    ]
  }
}
