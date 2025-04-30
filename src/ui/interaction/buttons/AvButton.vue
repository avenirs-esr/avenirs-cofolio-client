<script setup lang="ts">
import type { AvButtonProps } from './types'
import { DSFR_ICONS } from '@/utils'

const props = withDefaults(defineProps<AvButtonProps>(), {
  label: '',
  variant: 'primary',
  size: 'md',
  icon: undefined,
  iconOnly: false,
  iconRight: false,
  disabled: false,
  isLoading: false,
  onClick: () => {},
})

const iconToRender = props.isLoading ? DSFR_ICONS.REFRESH : props.icon
</script>

<template>
  <DsfrButton
    v-bind="props"
    :icon="iconToRender"
    :no-outline="props.variant === 'tertiary-no-outline'"
    :secondary="props.variant === 'secondary'"
    :tertiary="props.variant === 'tertiary' || props.variant === 'tertiary-no-outline'"
  />
</template>

<style lang="scss" scoped>
.fr-icon-refresh-line::before,
.fr-icon-refresh-line::after {
  animation: spin 1.5s linear infinite;
  transform-origin: center;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
