export { default as StudentLastCompletedLevelBadge } from '@/features/student/skills/components/badges/StudentLastCompletedLevelBadge/StudentLastCompletedLevelBadge.vue'
export { default as StudentSkillLevelStatusBadge } from '@/features/student/skills/components/badges/StudentSkillLevelStatusBadge/StudentSkillLevelStatusBadge.vue'

export { default as StudentDetailedEducationalSkillCard } from '@/features/student/skills/components/cards/StudentDetailedEducationalSkillCard/StudentDetailedEducationalSkillCard.vue'
export { default as StudentDetailedSkillCard } from '@/features/student/skills/components/cards/StudentDetailedSkillCard/StudentDetailedSkillCard.vue'
export { default as StudentSkillCard, type StudentSkillCardProps } from '@/features/student/skills/components/cards/StudentSkillCard/StudentSkillCard.vue'

export * from '@/features/student/skills/queries/use-program-progress.query/use-program-progress.query'
export * from '@/features/student/skills/queries/use-skills-view.query/use-skills-view.query'

export { studentEducationSkillsRoute, studentProjectSkillsRoute, studentSkillRoute } from '@/features/student/skills/routes'

export { useSkillsStore } from '@/features/student/skills/stores/skills/skills'

export * from '@/features/student/skills/types/student-progress.types'

export { default as StudentEducationSkillsView } from '@/features/student/skills/views/StudentEducationSkillsView/StudentEducationSkillsView.vue'
export { default as StudentProjectSkillsView } from '@/features/student/skills/views/StudentProjectSkillsView/StudentProjectSkillsView.vue'
export { default as StudentSkillView } from '@/features/student/skills/views/StudentSkillView/StudentSkillView.vue'
