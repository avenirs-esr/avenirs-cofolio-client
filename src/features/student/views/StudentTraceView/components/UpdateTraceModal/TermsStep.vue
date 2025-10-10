<script setup lang="ts">
import { ESkillLevelStatus, type TraceDetailDTO } from '@/api/avenir-esr'
import { StudentSkillLevelStatusBadge } from '@/features/student'
import { AvList, AvListItem, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { trace } = defineProps<{ trace: TraceDetailDTO }>()
const { t } = useI18n()
const isActiveStatus = [ESkillLevelStatus.NOT_STARTED, ESkillLevelStatus.TO_BE_EVALUATED, ESkillLevelStatus.UNDER_ACQUISITION]
const skillLevelAssociations = computed(() => trace.associationsTrace && trace.associationsTrace.skillLevelAssociations ? trace.associationsTrace.skillLevelAssociations : [])
const additionalSkillAssociations = computed(() => trace.associationsTrace && trace.associationsTrace.additionalSkillAssociations ? trace.associationsTrace.additionalSkillAssociations : [])

function getListIcon (skillStatus: ESkillLevelStatus) {
  return isActiveStatus.includes(skillStatus)
    ? MDI_ICONS.RECORD_CIRCLE_OUTLINE
    : MDI_ICONS.CLOSE_CIRCLE_OUTLINE
}

function getListIconColor (skillStatus: ESkillLevelStatus) {
  return isActiveStatus.includes(skillStatus)
    ? 'var(--dark-background-primary1)'
    : 'var(--text2)'
}

function getTextColor (skillStatus: ESkillLevelStatus) {
  return isActiveStatus.includes(skillStatus)
    ? ''
    : 'var(--text2)'
}

function shouldDisplayStatusBadge (skillStatus: ESkillLevelStatus) {
  return !isActiveStatus.includes(skillStatus)
}
</script>

<template>
  <div class="terms-step-container">
    <span class="caption-regular">{{ t('student.views.studentTraceView.updateTraceModal.steps.terms.impactMessage') }}</span>
    <AvList
      size="small"
      role="list"
    >
      <AvListItem
        v-for="skillLevel in skillLevelAssociations"
        :key="skillLevel.id"
        :title="skillLevel.skillTitle"
        :icon="getListIcon(skillLevel.status)"
        :icon-color="getListIconColor(skillLevel.status)"
        :color="getTextColor(skillLevel.status)"
      >
        <StudentSkillLevelStatusBadge
          v-if="shouldDisplayStatusBadge(skillLevel.status)"
          :status="skillLevel.status"
        />
      </AvListItem>
      <AvListItem
        v-for="additionalSkill in additionalSkillAssociations"
        :key="additionalSkill.id"
        :title="additionalSkill.title"
        :icon="MDI_ICONS.RECORD_CIRCLE_OUTLINE"
        icon-color="var(--dark-background-primary1)"
      />
    </AvList>
    <span class="b2-regular alert-message">{{ t('student.views.studentTraceView.updateTraceModal.steps.terms.alertMessage') }}</span>
  </div>
</template>

<style lang="scss" scoped>
.terms-step-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  font-size: var(--font-size-m);
  color: var(--color-on-surface-variant);
}

.skill-not-validated {
  color: var(--text2) !important;
}

.alert-message {
  color: var(--light-foreground-error);
}
</style>
