<script lang="ts" setup>
import type { SkillViewDTO } from '@/api/avenir-esr'
import { StudentDetailedSkillCard } from '@/features/student/components/cards'
import { AvBadge, MDI_ICONS } from '@/ui'

export interface StudentDetailedEducationaSkillCardProps {
  skill: SkillViewDTO
}

const { skill } = defineProps<StudentDetailedEducationaSkillCardProps>()
const { levelCount } = skill

const basePath = import.meta.env.BASE_URL
</script>

<template>
  <StudentDetailedSkillCard
    :skill="skill"
    skill-color="var(--light-background-neutral)"
    :icon="MDI_ICONS.STAR_SHOOTING_OUTLINE"
    color="var(--text1)"
  >
    <div class="body-container">
      <div class="line-container">
        <AvBadge
          :label="`${levelCount} niveaux`"
          color="var(--foreground-text)"
          background-color="var(--surface-background)"
          :icon-path="`${basePath}assets/icons/text-box-check-outline.svg`"
          small
          ellipsis
        />
      </div>
    </div>
  </StudentDetailedSkillCard>
</template>

<style lang="scss" scoped>
.student-detailed-skill-card {
  display: flex;
  width: 100%;
  border-radius: 1.5rem;
}

.body-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xxs);
  padding-top: var(--spacing-xs);
}

.line-container {
  display: flex;
  flex-direction: row;
  justify-content: right;
  align-items: center;
  padding-right: 3.5rem;
  gap: var(--spacing-xs);
}
</style>
