<script setup lang="ts">
import { AvBadge } from '@/ui'

defineProps<{ label: string, backgroundColor: string }>()
</script>

<template>
  <AvBadge
    :label="label"
    color="white"
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
