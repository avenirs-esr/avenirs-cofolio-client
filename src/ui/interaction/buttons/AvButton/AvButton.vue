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
})

const loadingIcon: InstanceType<typeof VIcon>['$props'] = { name: MDI_ICONS.LOADING, animation: 'spin' }
const iconToRender = computed(() => props.isLoading ? loadingIcon : props.icon)
const variantClass = computed(() => `av-button--variant-${props.variant.toLowerCase()}`)
const themeClass = computed(() => `av-button--theme-${props.theme.toLowerCase()}`)
const computedSvgScale = computed(() => {
  switch (props.size) {
    case 'small':
    case 'sm':
      return 1
    case 'medium':
    case 'md':
      return 1.5
    case 'large':
    case 'lg':
      return 2
    default:
      return 1.5
  }
})

defineExpose({ computedSvgScale })
</script>

<template>
  <DsfrButton
    v-bind="props"
    class="av-button"
    :class="[variantClass, themeClass]"
    :disabled="props.disabled || isLoading"
    :icon="iconToRender"
    :no-outline="props.variant === 'DEFAULT'"
    :tertiary="true"
  />
</template>

<style lang="scss" scoped>
:deep(svg) {
  scale: v-bind('computedSvgScale');
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
