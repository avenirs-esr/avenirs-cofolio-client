<script setup lang="ts">
import type { ActivityContentDTO } from '@/api/avenir-esr'
import { ICONS } from '@/common/constants'
import { AvIconText } from '@avenirs-esr/avenirs-dsav'

interface NationalActivityContentTabProps {
  activity: ActivityContentDTO
}

const { activity } = defineProps<NationalActivityContentTabProps>()
</script>

<template>
  <div
    class="av-col av-gap-xl"
    data-testid="national-activity-catalog-content-tab"
  >
    <AvIconText
      :icon="ICONS.ACTIVITY"
      :text="activity.title"
      typography-class="n4"
      text-color="var(--dark-background-primary1)"
      icon-color="var(--icon)"
      data-testid="national-activity-content-tab-title"
    />
  </div>
</template>
