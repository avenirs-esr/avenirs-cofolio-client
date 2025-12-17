import type { AvRoute } from '@/common/types/router.types'
import { ROUTES } from '@/common/constants'

export const studentEducationSkillsRoute: AvRoute = {
  ...ROUTES.STUDENT.EDUCATION_SKILLS,
  component: () => import('@/features/student/skills/views/StudentEducationSkillsView/StudentEducationSkillsView.vue')
}

export const studentProjectSkillsRoute: AvRoute = {
  ...ROUTES.STUDENT.PROJECT_SKILLS,
  component: () => import('@/features/student/skills/views/StudentProjectSkillsView/StudentProjectSkillsView.vue')
}

export const studentSkillRoute: AvRoute = {
  ...ROUTES.STUDENT.SKILL,
  props: route => ({
    skillId: route.params.id,
  }),
  component: () => import('@/features/student/skills/views/StudentSkillView/StudentSkillView.vue')
}
