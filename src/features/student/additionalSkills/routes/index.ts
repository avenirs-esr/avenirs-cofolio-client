import type { AvRoute } from '@/common/types'
import { ROUTE_NAMES } from '@/common/constants'

export const studentAdditionalSkillRoute: AvRoute = {
  ...ROUTE_NAMES.STUDENT.ADDITIONAL_SKILL,
  props: route => ({
    skillId: route.params.id,
  }),
  component: () =>
    import('@/features/student/additionalSkills/views/StudentAdditionalSkillView/StudentAdditionalSkillView.vue'),
}

export const studentUpdateAdditionalSkillRoute: AvRoute = {
  ...ROUTE_NAMES.STUDENT.UPDATE_ADDITIONAL_SKILL,
  props: route => ({
    skillId: route.params.id,
  }),
  component: () =>
    import('@/features/student/additionalSkills/views/StudentUpdateAdditionalSkillView/StudentUpdateAdditionalSkillView.vue'),
}
