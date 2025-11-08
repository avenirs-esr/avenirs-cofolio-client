<script lang="ts" setup>
import type { ComputedRef } from 'vue'
import { ESkillLevelStatus, type SkillDTO, type SkillLevelViewDTO } from '@/api/avenir-esr'
import { StudentCountAmsIconText } from '@/features/student/ams'
import StudentLastCompletedLevelBadge from '@/features/student/skills/components/badges/StudentLastCompletedLevelBadge/StudentLastCompletedLevelBadge.vue'
import StudentSkillLevelStatusBadge from '@/features/student/skills/components/badges/StudentSkillLevelStatusBadge/StudentSkillLevelStatusBadge.vue'
import StudentDetailedSkillCard from '@/features/student/skills/components/cards/StudentDetailedSkillCard/StudentDetailedSkillCard.vue'
import { StudentCountTracesIconText } from '@/features/student/traces'
import { AvBadge, ICONS_DATA_URL, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'

export interface StudentDetailedEducationalSkillCardProps {
  skill: SkillDTO
  skillColor: string
}

const { skill, skillColor } = defineProps<StudentDetailedEducationalSkillCardProps>()
const { levelCount, currentSkillLevel } = skill
const { traceCount, activityCount } = currentSkillLevel

const showLevelBadge = computed((): boolean => {
  const badgeVisibleStatuses: ESkillLevelStatus[] = [
    ESkillLevelStatus.TO_BE_EVALUATED,
    ESkillLevelStatus.UNDER_REVIEW,
  ]
  return badgeVisibleStatuses.includes(currentSkillLevel.status)
})

const lastAchievedSkillLevel: ComputedRef< SkillLevelViewDTO | undefined> = computed(() => skill.achievedSkillLevels)
</script>

<template>
  <StudentDetailedSkillCard
    :id="skill.id"
    :name="skill.name"
    :skill-color="skillColor"
    :icon="MDI_ICONS.STAR_SHOOTING_OUTLINE"
    color="var(--card2)"
  >
    <div class="body-container">
      <div class="firstline-container">
        <div class="line-container">
          <span class="n6">{{ skill.currentSkillLevel.name }}</span>
          <StudentSkillLevelStatusBadge
            v-if="showLevelBadge"
            :status="currentSkillLevel.status"
          />
        </div>
        <div class="line-container">
          <AvBadge
            :label="`${levelCount} niveaux`"
            color="var(--foreground-text)"
            background-color="var(--surface-background)"
            :icon-data-url="ICONS_DATA_URL.MDI_TEXT_BOX_CHECK_OUTLINE"
            small
            ellipsis
          />
          <StudentLastCompletedLevelBadge
            v-if="lastAchievedSkillLevel"
            :level="lastAchievedSkillLevel"
          />
        </div>
      </div>
      <div class="line-container">
        <span class="s2-regular">{{ skill.currentSkillLevel.shortDescription }}</span>
      </div>
      <div class="line-container">
        <StudentCountTracesIconText
          :count-traces="traceCount"
          gap="0.75rem"
          inline
        />
        <StudentCountAmsIconText
          :count-ams="activityCount"
          gap="0.75rem"
          inline
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
</style>
