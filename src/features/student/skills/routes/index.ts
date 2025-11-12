import type { AvRoute } from '@/common/types/router.types'
import { ROUTE_NAMES } from '@/common/constants'

export const studentEducationSkillsRoute: AvRoute = {
  ...ROUTE_NAMES.STUDENT.EDUCATION_SKILLS,
  component: () => import('@/features/student/skills/views/StudentEducationSkillsView/StudentEducationSkillsView.vue')
}

export const studentProjectSkillsRoute: AvRoute = {
  ...ROUTE_NAMES.STUDENT.PROJECT_SKILLS,
  component: () => import('@/features/student/skills/views/StudentProjectSkillsView/StudentProjectSkillsView.vue')
}

export const studentSkillRoute: AvRoute = {
  ...ROUTE_NAMES.STUDENT.SKILL,
  props: route => ({
    skillId: route.params.id,
  }),
  component: () => import('@/features/student/skills/views/StudentSkillView/StudentSkillView.vue')
}
