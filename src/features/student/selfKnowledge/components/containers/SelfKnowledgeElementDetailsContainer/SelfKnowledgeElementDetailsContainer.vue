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
  <div class="av-flex-col-md">
    <div class="self-knowledge-element-details-container__title av-row-lg av-row-lg--top av-row-lg--between">
      <span class="n4">{{ elementTitle }}</span>
      <slot name="title" />
    </div>

    <slot />
  </div>
</template>

<style lang="scss" scoped>
.self-knowledge-element-details-container {
  &__title {
    gap: var(--spacing-sm);
    padding: 0 0 var(--spacing-md) 0;
  }
}

.n4 {
  color: var(--text2);
}
</style>
