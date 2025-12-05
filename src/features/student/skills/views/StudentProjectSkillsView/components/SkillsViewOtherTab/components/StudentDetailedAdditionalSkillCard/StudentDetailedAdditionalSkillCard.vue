<script lang="ts" setup>
import type { AdditionalSkillDTO, AdditionalSkillProgressDTO } from '@/api/avenir-esr'

import { ROUTE_NAMES } from '@/common/constants'
import StudentDetailedSkillCard from '@/features/student/skills/components/cards/StudentDetailedSkillCard/StudentDetailedSkillCard.vue'
import { AvBadge, type AvBadgeProps, ICONS_DATA_URL, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface StudentDetailedAdditionalSkillCardProps {
  additionalSkill: AdditionalSkillDTO | AdditionalSkillProgressDTO
}

const { additionalSkill } = defineProps<StudentDetailedAdditionalSkillCardProps>()
const { t } = useI18n()
const additionalSkillColor = 'var(--dark-background-primary1)'
const typeBadge = computed<AvBadgeProps>(() => ({
  label: t(`student.additionalSkills.additionalSkillTypes.${additionalSkill.type}`),
  color: 'var(--text1)',
  borderColor: 'var(--other-border-skill-card)',
  backgroundColor: 'var(--surface-background)',
  icon: ICONS_DATA_URL.MDI_BOOKMARK_CHECK
}))

const pathBadge = computed<AvBadgeProps>(() => ({
  label: additionalSkill.pathSegments.join(' > '),
  color: 'var(--dark-background-accent)',
  backgroundColor: 'var(--light-background-accent)',
  icon: ICONS_DATA_URL.MDI_STARS
}))
</script>

<template>
  <StudentDetailedSkillCard
    :id="additionalSkill.id"
    :name="additionalSkill.title"
    :skill-color="additionalSkillColor"
    :icon="MDI_ICONS.STARS"
    :to="ROUTE_NAMES.STUDENT.ADDITIONAL_SKILL.name"
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
            v-if="additionalSkill.pathSegments.length > 0"
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
  margin-top: calc(-1 * var(--spacing-xs));
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
