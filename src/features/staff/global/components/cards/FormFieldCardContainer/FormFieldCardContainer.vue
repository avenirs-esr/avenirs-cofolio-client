<script setup lang="ts">
import type { Slot } from 'vue'

export interface FormFieldCardContainerProps {
  orientation?: 'vertical' | 'horizontal'
}

const { orientation = 'vertical' } = defineProps<FormFieldCardContainerProps>()
defineSlots<{
  title?: Slot
  default?: Slot
}>()
</script>

<template>
  <AvCard>
    <div
      :class="orientation === 'horizontal' ? 'av-row' : 'av-col'"
      :data-testid="`${orientation}-container`"
    >
      <slot name="title" />
      <slot />
    </div>
  </AvCard>
</template>
