<script lang="ts" setup>
import { ICONS } from '@/common/constants'
import { AvBadge } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface FeedbackIterationBadgeProps {
  iteration: number
  maxIterations?: number
  color?: string
  backgroundColor?: string
}

const {
  iteration,
  maxIterations,
  color = 'var(--text1)',
  backgroundColor = 'var(--light-background-neutral)',
} = defineProps<FeedbackIterationBadgeProps>()

const { t } = useI18n()

const label = computed(() =>
  t('staff.feedbacks.badges.feedbackIteration.label', { iteration })
)

const resolvedLabel = computed(() =>
  maxIterations && maxIterations > 0
    ? `${label.value}/${maxIterations}`
    : label.value
)
</script>

<template>
  <AvBadge
    data-testid="feedback-iteration-badge"
    :label="resolvedLabel"
    :icon="ICONS.FEEDBACK"
    :color="color"
    :background-color="backgroundColor"
    border-color="transparent"
  />
</template>
