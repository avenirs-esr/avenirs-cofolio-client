<script setup lang="ts">
import { AvBadge, type AvBadgeProps } from '@avenirs-esr/avenirs-dsav'

interface WarningBadgeProps extends Omit<AvBadgeProps, 'color' | 'backgroundColor'> {
}

const props = defineProps<WarningBadgeProps>()
</script>

<template>
  <AvBadge
    v-bind="props"
    color="var(--dark-background-warn)"
    background-color="var(--light-background-warn)"
  />
</template>
