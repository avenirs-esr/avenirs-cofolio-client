<script setup lang="ts">
import { AvBadge } from '@avenirs-esr/avenirs-dsav'

const {
  color = 'white',
  backgroundColor = 'var(--dark-background-primary1)'
} = defineProps<{
  label: string
  backgroundColor?: string
  color?: string
}>()
</script>

<template>
  <AvBadge
    :label="label"
    :color="color"
    :border-color="backgroundColor"
    :background-color="backgroundColor"
    class="additional-skill-type-badge"
  />
</template>

<style lang="scss">
.fr-badge.av-badge.additional-skill-type-badge {
  border-radius: var(--radius-xl);
  padding: var(--spacing-xs);
  height: var(--dimension-md);
  font-size: var(--font-size-sm) !important;
  font-weight: var(--font-weight-regular) !important;
}

.fr-badge.av-badge.additional-skill-type-badge::before {
  display: none !important;
  content: none !important;
}
</style>
