<script lang="ts" setup>
import { SkillLevelStatus, type SkillViewDTO } from '@/api/avenir-esr'
import { StudentCountAmsIconText, StudentCountTracesIconText, StudentLevelBadge } from '@/features/student/components/'
import { StudentDetailedSkillCard } from '@/features/student/components/cards'
import { AvBadge, MDI_ICONS } from '@/ui'

export interface StudentDetailedEducationaSkillCardProps {
  skill: SkillViewDTO
  skillColor: string
}

const { skill, skillColor } = defineProps<StudentDetailedEducationaSkillCardProps>()
const { traceCount, activityCount, levelCount, currentSkillLevel } = skill

const showLevelBadge = computed(() => currentSkillLevel.status === SkillLevelStatus.TO_BE_EVALUATED || currentSkillLevel.status === SkillLevelStatus.UNDER_REVIEW)
const basePath = import.meta.env.BASE_URL
</script>

<template>
  <StudentDetailedSkillCard
    :skill="skill"
    :skill-color="skillColor"
    :icon="MDI_ICONS.STAR_SHOOTING_OUTLINE"
    color="var(--card2)"
  >
    <div class="body-container">
      <div class="firstline-container">
        <div class="line-container">
          <span class="n6">{{ skill.currentSkillLevel.name }}</span>
          <StudentLevelBadge
            v-if="showLevelBadge"
            :level="currentSkillLevel"
          />
        </div>
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
  gap: 0.25rem;
  padding-top: 0.5rem;
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
    gap: 1rem;
    align-items: center;
}

.n6 {
  color: var(--text1);
}
</style>
