<script setup lang="ts">
import type { VIcon } from '@gouvminint/vue-dsfr'
import { type AvButtonProps, MDI_ICONS } from '@/ui'

const props = withDefaults(defineProps<AvButtonProps>(), {
  variant: 'primary',
  size: 'md',
  iconOnly: false,
  iconRight: false,
  disabled: false,
  isLoading: false,
  color: '--dark-background-primary1',
  fullWidth: false,
})

const loadingIcon: InstanceType<typeof VIcon>['$props'] = { name: MDI_ICONS.LOADING, animation: 'spin' }
const iconToRender = computed(() => props.isLoading ? loadingIcon : props.icon)
const fullWidthClass = computed(() => props.fullWidth ? 'av-button__fullwidth' : undefined)
const computedFlexDirection = computed(() => props.iconRight ? 'row-reverse' : 'row')
const computedSvgScale = computed(() => {
  switch (props.size) {
    case 'sm':
      return 1
    case 'md':
      return 1.5
    case 'lg':
      return 2
    default:
      return 1.5
  }
})

const theme = ref({
  flexDirection: computedFlexDirection,
  scale: computedSvgScale
})
</script>

<template>
  <DsfrButton
    v-bind="props"
    :class="[`fr-btn${props.color}`, fullWidthClass]"
    :disabled="props.disabled || isLoading"
    :icon="iconToRender"
    :no-outline="props.variant === 'tertiary-no-outline'"
    :secondary="props.variant === 'secondary'"
    :tertiary="props.variant === 'tertiary' || props.variant === 'tertiary-no-outline'"
  />
</template>

<style lang="scss" scoped>
:deep(svg) {
  scale: v-bind('theme.scale');
}

.av-button__fullwidth {
  display: flex;
  flex-direction: v-bind('theme.flexDirection');
  justify-content: space-between;
  width: 100%;
}
</style>
