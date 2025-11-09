import type { AvRoute } from '@/common/types/router.types'
import type StudentEducationSkillsView from '@/features/student/skills/views/StudentEducationSkillsView/StudentEducationSkillsView.vue'
import type StudentProjectSkillsView from '@/features/student/skills/views/StudentProjectSkillsView/StudentProjectSkillsView.vue'
import type StudentSkillView from '@/features/student/skills/views/StudentSkillView/StudentSkillView.vue'

export const studentEducationSkillsRoute: AvRoute = {
  path: 'education/skills',
  name: 'student-education-skills',
  component: () => import('@/features/student/skills/views/StudentEducationSkillsView/StudentEducationSkillsView.vue') as Promise<{ default: typeof StudentEducationSkillsView }>
}

export const studentProjectSkillsRoute: AvRoute = {
  path: 'projects/skills',
  name: 'student-project-skills',
  component: () => import('@/features/student/skills/views/StudentProjectSkillsView/StudentProjectSkillsView.vue') as Promise<{ default: typeof StudentProjectSkillsView }>
}

export const studentSkillRoute: AvRoute = {
  path: 'skill/:id',
  name: 'student-skill',
  props: route => ({
    skillId: route.params.id,
  }),
  component: () => import('@/features/student/skills/views/StudentSkillView/StudentSkillView.vue') as Promise<{ default: typeof StudentSkillView }>
}
