<script setup lang="ts">
import { AvTooltip, useTextTruncation } from '@avenirs-esr/avenirs-dsav'

export interface AssessmentActivityTitleProps {
  activityTitle: string
}

const { activityTitle } = defineProps<AssessmentActivityTitleProps>()

const activityTitleRef = ref<HTMLElement | null>(null)
const { isTruncated } = useTextTruncation(activityTitleRef)
</script>

<template>
  <AvTooltip
    :disabled="!isTruncated"
    :content="activityTitle"
  >
    <span
      ref="activityTitleRef"
      class="av-max-lines b1-bold av-text-text1"
    >
      {{ activityTitle }}
    </span>
  </AvTooltip>
</template>
