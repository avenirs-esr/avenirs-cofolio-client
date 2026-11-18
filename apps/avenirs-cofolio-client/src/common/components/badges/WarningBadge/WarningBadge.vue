<script setup lang="ts">
import type { AvBadgeProps } from '@avenirs-esr/avenirs-dsav'
import type { ComputedRef } from 'vue'
import { AvBadge, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'

export interface WarningBadgeProps extends Omit<AvBadgeProps, 'color' | 'backgroundColor' | 'borderColor'> {}

const {
  icon = MDI_ICONS.WARNING_OUTLINE,
  small = false,
  ellipsis = false,
  noSentenceCase = false,
  ...restProps
} = defineProps<WarningBadgeProps>()

const avBadgeProps: ComputedRef<AvBadgeProps> = computed(() => ({
  ...restProps,
  color: 'var(--dark-background-warn)',
  backgroundColor: 'var(--light-background-warn)',
  borderColor: 'var(--dark-background-warn)',
  icon,
  small,
  ellipsis,
  noSentenceCase
}))
</script>

<template>
  <AvBadge v-bind="avBadgeProps" />
</template>
