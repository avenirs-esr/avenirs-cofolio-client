<script lang="ts" setup>
import type { Slot } from 'vue'

export interface SelfKnowledgeElementDetailsContainerProps {
  elementTitle: string
}

defineProps<SelfKnowledgeElementDetailsContainerProps>()

defineSlots<{
  title?: Slot
  default?: Slot
}>()
</script>

<template>
  <div class="av-col av-flex-fill av-gap-md">
    <div class="av-row--lg av-align-start--lg av-justify-between--lg av-gap-sm av-pb-md">
      <span class="n4 av-text-text2">{{ elementTitle }}</span>
      <slot name="title" />
    </div>

    <slot />
  </div>
</template>
