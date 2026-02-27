<script setup lang="ts">
import { AvBadge, RI_ICONS } from '@avenirs-esr/avenirs-dsav'

export interface ActivityPeriodSummaryBadgeProps {
  summary: string
  small?: boolean
}

const { summary } = defineProps<ActivityPeriodSummaryBadgeProps>()
</script>

<template>
  <AvBadge
    v-bind="$props"
    :label="summary"
    :icon="RI_ICONS.TIMER_LINE"
    color="var(--text1)"
    background-color="var(--surface-background)"
    border-color="var(--stroke)"
  />
</template>
