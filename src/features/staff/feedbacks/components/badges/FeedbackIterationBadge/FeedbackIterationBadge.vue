<script lang="ts" setup>
import { ICONS } from '@/common/constants'
import { AvBadge } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface FeedbackIterationBadgeProps {
  iteration: number
  maxIterations?: number
}

const { iteration, maxIterations } = defineProps<FeedbackIterationBadgeProps>()

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
    color="var(--text1)"
    background-color="var(--light-background-neutral)"
    border-color="transparent"
  />
</template>
