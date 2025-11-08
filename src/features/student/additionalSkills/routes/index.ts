import type { AvRoute } from '@/common/types'
import type StudentAdditionalSkillView from '@/features/student/additionalSkills/views/StudentAdditionalSkillView/StudentAdditionalSkillView.vue'
import type StudentUpdateAdditionalSkillView from '@/features/student/additionalSkills/views/StudentUpdateAdditionalSkillView/StudentUpdateAdditionalSkillView.vue'

export const studentAdditionalSkillRoute: AvRoute = {
  path: 'additional-skill/:id',
  name: 'student-additional-skill',
  props: route => ({
    skillId: route.params.id,
  }),
  component: () =>
    import('@/features/student/additionalSkills/views/StudentAdditionalSkillView/StudentAdditionalSkillView.vue') as Promise<{
      default: typeof StudentAdditionalSkillView
    }>,
}

export const studentUpdateAdditionalSkillRoute: AvRoute = {
  path: 'update-additional-skill/:id',
  name: 'student-update-additional-skill',
  props: route => ({
    skillId: route.params.id,
  }),
  component: () =>
    import('@/features/student/additionalSkills/views/StudentUpdateAdditionalSkillView/StudentUpdateAdditionalSkillView.vue') as Promise<{
      default: typeof StudentUpdateAdditionalSkillView
    }>,
}
