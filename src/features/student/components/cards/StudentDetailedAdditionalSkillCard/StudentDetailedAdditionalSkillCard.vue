<script lang="ts" setup>
import type { AdditionalSkillDTO, AdditionalSkillProgressDTO } from '@/api/avenir-esr'

import { StudentDetailedSkillCard } from '@/features/student/components/cards'
import { AvBadge, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'

export interface StudentDetailedAdditionalSkillCardProps {
  additionalSkill: AdditionalSkillDTO | AdditionalSkillProgressDTO
}

const { additionalSkill } = defineProps<StudentDetailedAdditionalSkillCardProps>()
const basePath = import.meta.env.BASE_URL
const additionalSkillColor = 'var(--dark-background-primary1)'
const typeBadge = {
  label: additionalSkill.type,
  color: 'var(--text1)',
  borderColor: 'var(--other-border-skill-card)',
  backgroundColor: 'var(--surface-background)',
  iconPath: `${basePath}assets/icons/bookmark-check.svg`
}
const pathBadge = {
  label: additionalSkill.pathSegments.join(', '),
  color: 'var(--dark-background-accent)',
  backgroundColor: 'var(--light-background-accent)',
  iconPath: `${basePath}assets/icons/stars.svg`
}
</script>

<template>
  <StudentDetailedSkillCard
    :id="additionalSkill.id"
    :name="additionalSkill.title"
    :skill-color="additionalSkillColor"
    :icon="MDI_ICONS.STARS"
    color="var(--card2)"
  >
    <div class="body-container">
      <div class="firstline-container">
        <div class="line-container">
          <AvBadge
            v-bind="typeBadge"
            small
            ellipsis
          />
          <AvBadge
            v-bind="pathBadge"
            small
            ellipsis
          />
        </div>
      </div>
    </div>
  </StudentDetailedSkillCard>
</template>

<style lang="scss" scoped>
.body-container {
   display: flex;
   flex-direction: column;
   justify-content: space-between;
   gap: var(--spacing-xxs);
   padding-top: var(--spacing-xs);
 }

.firstline-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-right: 3.5rem;
}

.line-container {
  display: flex;
  flex-direction: row;
  gap: var(--spacing-sm);
  align-items: center;
}

.n6 {
  color: var(--text1);
}

.n5 {
  color: var(--other-background-base);
}

:deep(.av-card){
  justify-content: flex-start;
}
</style>
