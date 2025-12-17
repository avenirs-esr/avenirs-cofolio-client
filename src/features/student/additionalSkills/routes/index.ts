import type { AvRoute } from '@/common/types'
import { ROUTES } from '@/common/constants'

export const studentAdditionalSkillRoute: AvRoute = {
  ...ROUTES.STUDENT.ADDITIONAL_SKILL,
  props: route => ({
    skillId: route.params.id,
  }),
  component: () =>
    import('@/features/student/additionalSkills/views/StudentAdditionalSkillView/StudentAdditionalSkillView.vue'),
}

export const studentUpdateAdditionalSkillRoute: AvRoute = {
  ...ROUTES.STUDENT.UPDATE_ADDITIONAL_SKILL,
  props: route => ({
    skillId: route.params.id,
  }),
  component: () =>
    import('@/features/student/additionalSkills/views/StudentUpdateAdditionalSkillView/StudentUpdateAdditionalSkillView.vue'),
}
