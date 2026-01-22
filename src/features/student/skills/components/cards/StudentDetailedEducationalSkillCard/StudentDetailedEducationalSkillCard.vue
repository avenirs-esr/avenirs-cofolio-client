<script lang="ts" setup>
import type { ComputedRef } from 'vue'
import { ESkillLevelStatus, type SkillDTO, type SkillLevelViewDTO } from '@/api/avenir-esr'
import StudentCountAmsIconText from '@/features/student/ams/components/base/StudentCountAmsIconText/StudentCountAmsIconText.vue'
import StudentLastCompletedLevelBadge from '@/features/student/skills/components/badges/StudentLastCompletedLevelBadge/StudentLastCompletedLevelBadge.vue'
import StudentSkillLevelStatusBadge from '@/features/student/skills/components/badges/StudentSkillLevelStatusBadge/StudentSkillLevelStatusBadge.vue'
import StudentDetailedSkillCard from '@/features/student/skills/components/cards/StudentDetailedSkillCard/StudentDetailedSkillCard.vue'
import StudentCountTracesIconText from '@/features/student/traces/components/base/StudentCountTracesIconText/StudentCountTracesIconText.vue'
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
    <div class="av-col av-gap-xxs av--mt-xs">
      <div class="av-row av-justify-between av-align-center av-pr-4xl">
        <div class="av-row av-gap-sm av-align-center">
          <span class="n6 av-text-text1">{{ skill.currentSkillLevel.name }}</span>
          <StudentSkillLevelStatusBadge
            v-if="showLevelBadge"
            :status="currentSkillLevel.status"
          />
        </div>
        <div class="av-row av-gap-sm av-align-center">
          <AvBadge
            :label="`${levelCount} niveaux`"
            color="var(--foreground-text)"
            background-color="var(--surface-background)"
            :icon="ICONS_DATA_URL.MDI_TEXT_BOX_CHECK_OUTLINE"
            small
            ellipsis
          />
          <StudentLastCompletedLevelBadge
            v-if="lastAchievedSkillLevel"
            :level="lastAchievedSkillLevel"
          />
        </div>
      </div>
      <div class="av-row av-gap-sm av-align-center">
        <span class="s2-regular">{{ skill.currentSkillLevel.shortDescription }}</span>
      </div>
      <div class="av-row av-gap-sm av-align-center">
        <StudentCountTracesIconText
          :count-traces="traceCount"
          inline
        />
        <StudentCountAmsIconText
          :count-ams="activityCount"
          inline
        />
      </div>
    </div>
  </StudentDetailedSkillCard>
</template>
