<script setup lang="ts">
import type { AvBadgeProps } from '@avenirs-esr/avenirs-dsav'
import type { ComputedRef } from 'vue'
import { AvBadge, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'

export interface ErrorBadgeProps extends Omit<AvBadgeProps, 'color' | 'backgroundColor' | 'borderColor'> {}

const {
  icon = MDI_ICONS.CLOSE_OCTAGON,
  small = false,
  ellipsis = false,
  noSentenceCase = false,
  ...restProps
} = defineProps<ErrorBadgeProps>()

const avBadgeProps: ComputedRef<AvBadgeProps> = computed(() => ({
  ...restProps,
  color: 'var(--dark-background-error)',
  backgroundColor: 'var(--light-background-error)',
  borderColor: 'var(--dark-background-error)',
  icon,
  small,
  ellipsis,
  noSentenceCase
}))
</script>

<template>
  <AvBadge v-bind="avBadgeProps" />
</template>
