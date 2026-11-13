<script setup lang="ts">
import type { SubActivityOverviewDTO } from '@avenirs-esr/shared/api/avenir-esr'
import { AvIconText } from '@avenirs-esr/avenirs-dsav'
import { Card, ICONS } from '@avenirs-esr/shared'

export interface SubActivityDetailsProps {
  subActivity: SubActivityOverviewDTO
}

const { subActivity } = defineProps<SubActivityDetailsProps>()
</script>

<template>
  <div
    class="av-col av-gap-md"
    data-testid="sub-activity-details"
  >
    <Card
      background-color="var(--card2)"
      border-color="transparent"
    >
      <AvIconText
        data-testid="sub-activity-title"
        :icon="ICONS.ACTIVITY"
        icon-color="var(--icon)"
        :text="subActivity.title"
        text-color="var(--dark-background-primary1)"
        typography-class="n4"
        gap="var(--spacing-md)"
        class="av-wrap-anywhere"
        inline
      />
    </Card>
  </div>
</template>
