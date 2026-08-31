import type { AvRoute } from '@/common/types'
import { ROUTES } from '@/common/constants'

export const studentProjectDeclaredSkillRoute: AvRoute = {
  ...ROUTES.STUDENT.PROJECT_DECLARED_SKILL,
  props: route => ({
    skillId: route.params.id,
  }),
  component: () =>
    import('@/features/declaredSkills/views/StudentDeclaredSkillView/StudentDeclaredSkillView.vue'),
}

export const studentUpdateDeclaredSkillRoute: AvRoute = {
  ...ROUTES.STUDENT.UPDATE_DECLARED_SKILL,
  props: route => ({
    skillId: route.params.id,
  }),
  component: () =>
    import('@/features/declaredSkills/views/StudentUpdateDeclaredSkillView/StudentUpdateDeclaredSkillView.vue'),
}
