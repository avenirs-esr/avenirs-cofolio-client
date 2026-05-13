<script setup lang="ts">
import { AvPeriodInput } from '@avenirs-esr/avenirs-dsav'

export interface ActivityPeriodDisplayProps {
  startDate?: string
  endDate?: string
}
defineProps<ActivityPeriodDisplayProps>()
</script>

<template>
  <AvPeriodInput
    data-testid="activity-period-input"
    label=""
    :start-model-value="startDate"
    :end-model-value="endDate"
    :start-label="$t('global.beginning')"
    :end-label="$t('global.end')"
    start-date-disabled
    end-date-disabled
    show-each-input-label
  />
</template>
