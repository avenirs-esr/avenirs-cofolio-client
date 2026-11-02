<script lang="ts" setup>
import { AvBadge, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { EDeclaredActivityStatus } from '@/api/avenir-esr'

export interface AssessmentStatusBadgeProps {
  assessmentStatus: EDeclaredActivityStatus
}

const { assessmentStatus } = defineProps<AssessmentStatusBadgeProps>()

const { t } = useI18n()

const label = computed(() =>
  t(`staff.assessments.badges.assessmentStatus.${assessmentStatus}`)
)

const icon = computed(() => {
  switch (assessmentStatus) {
    case EDeclaredActivityStatus.SUBMITTED_FOR_ASSESSMENT:
    case EDeclaredActivityStatus.CONSULTED:
      return MDI_ICONS.BELL_NOTIFICATION

    case EDeclaredActivityStatus.COMPLETED:
    default:
      return MDI_ICONS.CHECK_CIRCLE
  }
})

const color = computed(() => {
  switch (assessmentStatus) {
    case EDeclaredActivityStatus.CONSULTED:
      return 'var(--light-foreground-error)'

    case EDeclaredActivityStatus.SUBMITTED_FOR_ASSESSMENT:
      return 'var(--light-foreground-success)'

    case EDeclaredActivityStatus.COMPLETED:
    default:
      return 'var(--text1)'
  }
})

const backgroundColor = computed(() => {
  switch (assessmentStatus) {
    case EDeclaredActivityStatus.CONSULTED:
      return 'var(--light-background-error)'

    case EDeclaredActivityStatus.SUBMITTED_FOR_ASSESSMENT:
      return 'var(--light-background-success)'

    case EDeclaredActivityStatus.COMPLETED:
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
