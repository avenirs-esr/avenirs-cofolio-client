<script lang="ts" setup>
import type { SkillDTO, SkillLevelViewDTO } from '@/api/avenir-esr'
import type { ComputedRef } from 'vue'
import StudentLastCompletedLevelBadge from '@/features/student/skills/components/badges/StudentLastCompletedLevelBadge/StudentLastCompletedLevelBadge.vue'
import StudentDetailedSkillCard from '@/features/student/skills/components/cards/StudentDetailedSkillCard/StudentDetailedSkillCard.vue'
import { AvBadge, ICONS_DATA_URL, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface StudentDetailedEducationaSkillCardProps {
  skill: SkillDTO
}

const { skill } = defineProps<StudentDetailedEducationaSkillCardProps>()
const { levelCount } = skill
const lastAchievedSkillLevel: ComputedRef< SkillLevelViewDTO | undefined> = computed(() => skill.achievedSkillLevels)
const { t } = useI18n()
</script>

<template>
  <StudentDetailedSkillCard
    :id="skill.id"
    :name="skill.name"
    skill-color="var(--light-background-neutral)"
    :icon="MDI_ICONS.STAR_SHOOTING_OUTLINE"
    color="var(--text1)"
  >
    <div class="body-container">
      <div class="firstline-container">
        <div class="line-container">
          <AvBadge
            color="var(--foreground-text)"
            background-color="var(--surface-background)"
            :icon="ICONS_DATA_URL.FILE_DOCUMENT_MULTIPLE_OUTLINE"
            :label="t('student.cards.studentDetailedPastSkillCard.programFinished')"
            small
            ellipsis
          />
        </div>
        <div class="line-container">
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
    </div>
  </StudentDetailedSkillCard>
</template>

<style lang="scss" scoped>
.body-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xxs);
  margin-top: calc(-1 * var(--spacing-xs));
}

.line-container {
  display: flex;
  flex-direction: row;
  gap: var(--spacing-sm);
  align-items: center;
}

.firstline-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-right: 3.5rem;
}
:deep(.av-card){
  justify-content: flex-start;
}
</style>
