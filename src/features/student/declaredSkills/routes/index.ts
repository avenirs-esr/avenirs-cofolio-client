import type { AvRoute } from '@/common/types'
import { ROUTES } from '@/common/constants'

export const studentDeclaredSkillRoute: AvRoute = {
  ...ROUTES.STUDENT.DECLARED_SKILL,
  props: route => ({
    skillId: route.params.id,
  }),
  component: () =>
    import('@/features/student/declaredSkills/views/StudentDeclaredSkillView/StudentDeclaredSkillView.vue'),
}

export const studentUpdateDeclaredSkillRoute: AvRoute = {
  ...ROUTES.STUDENT.UPDATE_DECLARED_SKILL,
  props: route => ({
    skillId: route.params.id,
  }),
  component: () =>
    import('@/features/student/declaredSkills/views/StudentUpdateDeclaredSkillView/StudentUpdateDeclaredSkillView.vue'),
}
