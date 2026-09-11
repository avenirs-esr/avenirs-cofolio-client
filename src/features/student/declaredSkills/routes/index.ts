import type { AvRoute } from '@/common/types'
import { ROUTES } from '@/common/constants'
import { META_BREADCRUMBS } from '@/common/constants/meta-breadcrumbs'

export const studentProjectDeclaredSkillRoute: AvRoute = {
  ...ROUTES.STUDENT.PROJECT_DECLARED_SKILL,
  props: route => ({
    skillId: route.params.id,
  }),
  component: () =>
    import('@/features/student/declaredSkills/views/StudentDeclaredSkillView/StudentDeclaredSkillView.vue'),
  meta: {
    breadcrumb: [
      META_BREADCRUMBS.STUDENT.HOME,
      META_BREADCRUMBS.STUDENT.PROJECT.DEFAULT,
      META_BREADCRUMBS.STUDENT.PROJECT.SKILLS,
    ]
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
    breadcrumb: [
      META_BREADCRUMBS.STUDENT.HOME,
      META_BREADCRUMBS.STUDENT.PROJECT.DEFAULT,
      META_BREADCRUMBS.STUDENT.PROJECT.SKILLS,
    ],
  },
}
