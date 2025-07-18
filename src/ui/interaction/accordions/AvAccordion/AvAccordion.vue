<script lang="ts" setup>
import type { Slot } from 'vue'

/**
 * AvAccordion component props.
 */
export interface AvAccordionProps {
  /**
   * Title of the accordion.
   */
  title: string

  /**
   * Accordion icon
   */
  icon?: string
}

defineProps<AvAccordionProps>()

/**
 * Slots available in the AvAccordion component.
 * The default slot contains the content of the accordion.
 */
defineSlots<{
  /**
   * Default slot for accordion content.
   */
  default?: Slot
}>()
</script>

<template>
  <slot />
</template>
