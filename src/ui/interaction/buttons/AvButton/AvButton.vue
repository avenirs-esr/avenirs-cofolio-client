<script setup lang="ts">
import type { AvButtonProps } from '@/ui/interaction/buttons/AvButton'
import type { VIcon } from '@gouvminint/vue-dsfr'
import { MDI_ICONS } from '@/ui/tokens/icons'

const props = withDefaults(defineProps<AvButtonProps>(), {
  variant: 'DEFAULT',
  theme: 'PRIMARY',
  size: 'md',
  iconOnly: false,
  iconRight: false,
  disabled: false,
  isLoading: false,
  fullWidth: false,
})

const loadingIcon: InstanceType<typeof VIcon>['$props'] = { name: MDI_ICONS.LOADING, animation: 'spin' }
const iconToRender = computed(() => props.isLoading ? loadingIcon : props.icon)
const fullWidthClass = computed(() => props.fullWidth ? 'av-button__fullwidth' : undefined)
const variantClass = computed(() => `av-button--variant-${props.variant.toLowerCase()}`)
const themeClass = computed(() => `av-button--theme-${props.theme.toLowerCase()}`)
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
    :class="[variantClass, themeClass, fullWidthClass]"
    :disabled="props.disabled || isLoading"
    :icon="iconToRender"
    :no-outline="props.variant === 'DEFAULT'"
    :tertiary="true"
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

.av-button--variant-default.av-button--theme-primary {
  background-color: white;
  color: var(--dark-background-primary1) !important;
}

.av-button--variant-outlined.av-button--theme-primary {
  background-color: white;
  color: var(--dark-background-primary1) !important;
  border: 1px solid var(--dark-background-primary1) !important;
}

.av-button--variant-default.av-button--theme-secondary {
  background-color: white;
  color: var(--foreground-text1) !important;
}

.av-button--variant-outlined.av-button--theme-secondary {
  background-color: white;
  color: var(--foreground-text1) !important;
  border: 1px solid var(--foreground-text1) !important;
}

.av-button--theme-primary:hover {
  background-color: var(--dark-background-primary1) !important;
  color: white !important;
}

.av-button--theme-secondary:hover {
  background-color: var(--foreground-text1) !important;
  color: white !important;
}
</style>
