<script setup lang="ts">
import type { VIcon } from '@gouvminint/vue-dsfr'
import type { AvButtonProps } from './types'
import { MDI_ICONS } from '@/ui'

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

const loadingIcon: InstanceType<typeof VIcon>['$props'] = { name: MDI_ICONS.LOADING, animation: 'spin' }
const iconToRender = computed(() => props.isLoading ? loadingIcon : props.icon)
</script>

<template>
  <DsfrButton
    v-bind="props"
    :disabled="props.disabled || isLoading"
    :icon="iconToRender"
    :no-outline="props.variant === 'tertiary-no-outline'"
    :secondary="props.variant === 'secondary'"
    :tertiary="props.variant === 'tertiary' || props.variant === 'tertiary-no-outline'"
  />
</template>

<style lang="scss" scoped></style>
