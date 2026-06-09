<script lang="ts" setup>
import { EFeedbackStatus } from '@/api/avenir-esr'
import { AvBadge, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface FeedbackStatusBadgeProps {
  feedbackStatus: EFeedbackStatus
}

const { feedbackStatus } = defineProps<FeedbackStatusBadgeProps>()

const { t } = useI18n()

const label = computed(() =>
  t(`staff.activities.badges.feedbackStatus.${feedbackStatus}`)
)

const icon = computed(() => {
  switch (feedbackStatus) {
    case EFeedbackStatus.NEW:
    case EFeedbackStatus.IN_PROCESS:
      return MDI_ICONS.BELL_NOTIFICATION

    case EFeedbackStatus.SUBMITTED:
    default:
      return MDI_ICONS.CHECK_CIRCLE
  }
})

const color = computed(() => {
  switch (feedbackStatus) {
    case EFeedbackStatus.IN_PROCESS:
      return 'var(--light-foreground-error)'

    case EFeedbackStatus.NEW:
      return 'var(--light-foreground-success)'

    case EFeedbackStatus.SUBMITTED:
    default:
      return 'var(--text1)'
  }
})

const backgroundColor = computed(() => {
  switch (feedbackStatus) {
    case EFeedbackStatus.IN_PROCESS:
      return 'var(--light-background-error)'

    case EFeedbackStatus.NEW:
      return 'var(--light-background-success)'

    case EFeedbackStatus.SUBMITTED:
    default:
      return 'var(--light-background-neutral)'
  }
})
</script>

<template>
  <AvBadge
    data-testid="feedback-status-badge"
    :label="label"
    :icon="icon"
    :color="color"
    :background-color="backgroundColor"
    border-color="transparent"
  />
</template>
