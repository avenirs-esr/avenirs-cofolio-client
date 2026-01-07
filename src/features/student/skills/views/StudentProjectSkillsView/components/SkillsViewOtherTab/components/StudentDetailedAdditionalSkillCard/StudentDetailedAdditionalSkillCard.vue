<script lang="ts" setup>
import type { AdditionalSkillDTO, AdditionalSkillProgressDTO } from '@/api/avenir-esr'

import { ROUTES } from '@/common/constants'
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
    :to="ROUTES.STUDENT.ADDITIONAL_SKILL.name"
    color="var(--card2)"
  >
    <div class="av-col av-justify-between av--mt-xs av-gap-xxs">
      <div class="av-pr-5xl">
        <div class="av-row av-w-full av-align-center av-justify-between av-gap-sm av-wrap">
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
