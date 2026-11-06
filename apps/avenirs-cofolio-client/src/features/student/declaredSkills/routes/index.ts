import type { AvRoute } from '@avenirs-esr/shared'
import { ROUTES } from '@/common/constants'
import { BASE_BREADCRUMBS } from '@/common/constants/meta-breadcrumbs'

export const studentProjectDeclaredSkillRoute: AvRoute = {
  ...ROUTES.STUDENT.DECLARED_SKILL,
  props: route => ({
    skillId: route.params.id,
  }),
  component: () =>
    import('@/features/student/declaredSkills/views/StudentDeclaredSkillView/StudentDeclaredSkillView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STUDENT.SKILLS]
  }
}

export const studentUpdateDeclaredSkillRoute: AvRoute = {
  ...ROUTES.STUDENT.UPDATE_DECLARED_SKILL,
  props: route => ({
    skillId: route.params.id,
  }),
  component: () =>
    import('@/features/student/declaredSkills/views/StudentUpdateDeclaredSkillView/StudentUpdateDeclaredSkillView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STUDENT.SKILLS],
  },
}
