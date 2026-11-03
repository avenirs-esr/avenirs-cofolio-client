<script lang="ts" setup>
import { AvBadge, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { EActivityAssessmentStatus } from '@/api/avenir-esr'

export interface AssessmentStatusBadgeProps {
  assessmentStatus: EActivityAssessmentStatus
}

const { assessmentStatus } = defineProps<AssessmentStatusBadgeProps>()

const { t } = useI18n()

const label = computed(() =>
  t(`staff.assessments.badges.assessmentStatus.${assessmentStatus}`)
)

const icon = computed(() => {
  switch (assessmentStatus) {
    case EActivityAssessmentStatus.NEW:
    case EActivityAssessmentStatus.OPENED:
      return MDI_ICONS.BELL_NOTIFICATION

    case EActivityAssessmentStatus.SENT:
    default:
      return MDI_ICONS.CHECK_CIRCLE
  }
})

const color = computed(() => {
  switch (assessmentStatus) {
    case EActivityAssessmentStatus.OPENED:
      return 'var(--light-foreground-error)'

    case EActivityAssessmentStatus.NEW:
      return 'var(--light-foreground-success)'

    case EActivityAssessmentStatus.SENT:
    default:
      return 'var(--text1)'
  }
})

const backgroundColor = computed(() => {
  switch (assessmentStatus) {
    case EActivityAssessmentStatus.OPENED:
      return 'var(--light-background-error)'

    case EActivityAssessmentStatus.NEW:
      return 'var(--light-background-success)'

    case EActivityAssessmentStatus.SENT:
    default:
      return 'var(--light-background-neutral)'
  }
})
</script>

<template>
  <AvBadge
    data-testid="assessment-status-badge"
    :label="label"
    :icon="icon"
    :color="color"
    :background-color="backgroundColor"
    border-color="transparent"
  />
</template>
