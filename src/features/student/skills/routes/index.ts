import type { AvRoute } from '@/common/types/router.types'
import { ROUTES } from '@/common/constants'

export const studentProjectSkillsRoute: AvRoute = {
  ...ROUTES.STUDENT.PROJECT_SKILLS,
  component: () => import('@/features/student/skills/views/StudentProjectSkillsView/StudentProjectSkillsView.vue')
}
