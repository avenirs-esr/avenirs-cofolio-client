<script setup lang="ts">
import type { VIcon } from '@gouvminint/vue-dsfr'
import { MDI_ICONS } from '@/ui/tokens/icons'

/**
 * AvButton component props.
 */
export interface AvButtonProps {
  /**
   * Button variant: borderless (`DEFAULT`) or with border (`OUTLINED`).
   * @default 'DEFAULT'
   */
  variant?: 'DEFAULT' | 'OUTLINED'

  /**
   * Button theme: blue (`PRIMARY`) or gray (`SECONDARY`).
   * @default 'PRIMARY'
   */
  theme?: 'PRIMARY' | 'SECONDARY'

  /**
   * Indicates button loading status.
   * @default false
   */
  isLoading?: boolean

  /**
   * Manually change icon size.
   * If not defined, the size is automatically calculated.
   */
  iconScale?: number

  /**
   * Removes radii from the button border.
   * @default false
   */
  noRadius?: boolean

  /**
   * Indicates if the button is disabled.
   * @default false
   */
  disabled?: boolean

  /**
   * Button text label.
   */
  label: string

  /**
   * Indicates icon position:
   * left (`false`) or right (`true`).
   * @default false
   */
  iconRight?: boolean

  /**
   * Hide label text (`true`) or show it (`false`).
   * @default false
   */
  iconOnly?: boolean

  /**
   * Button size: 'sm', 'small', 'md', 'medium', 'lg', 'large' or ''.
   * @default 'md'
   */
  size?: 'sm' | 'small' | 'lg' | 'large' | 'md' | 'medium' | '' | undefined

  /**
   * Icon to be displayed in the button. Can be a name or an icon configuration.
   */
  icon?: string | InstanceType<typeof VIcon>['$props']

  /**
   * Function called when button is clicked.
   * @param event The click MouseEvent
   */
  onClick?: ($event: MouseEvent) => void
}

const props = withDefaults(defineProps<AvButtonProps>(), {
  variant: 'DEFAULT',
  theme: 'PRIMARY',
  size: 'md',
  iconOnly: false,
  iconRight: false,
  disabled: false,
  isLoading: false,
  noRadius: false
})

const loadingIcon: InstanceType<typeof VIcon>['$props'] = { name: MDI_ICONS.LOADING_OUTLINE, animation: 'spin' }
const iconToRender = computed(() => props.isLoading ? loadingIcon : props.icon)
const variantClass = computed(() => `av-button--variant-${props.variant.toLowerCase()}`)
const themeClass = computed(() => `av-button--theme-${props.theme.toLowerCase()}`)
const radiusClass = computed(() => props.noRadius ? 'av-button--no-radius' : '')

const computedSvgScale = computed(() => {
  if (props.iconScale && !Number.isNaN(props.iconScale)) {
    return props.iconScale
  }
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
    :class="[variantClass, themeClass, radiusClass]"
    :disabled="props.disabled || isLoading"
    :icon="iconToRender"
    :no-outline="props.variant === 'DEFAULT'"
    :tertiary="true"
    :aria-label="props.label"
    :title="props.label"
  />
</template>

<style lang="scss" scoped>
:deep(svg) {
  scale: v-bind('computedSvgScale');
}

.av-button--variant-default.av-button--theme-primary {
  background-color: var(--other-background-base);
  color: var(--dark-background-primary1) !important;
}

.av-button--variant-outlined.av-button--theme-primary {
  background-color: var(--other-background-base);
  color: var(--dark-background-primary1) !important;
  border: 1px solid var(--dark-background-primary1) !important;
}

.av-button--variant-default.av-button--theme-secondary {
  background-color: var(--other-background-base);
  color: var(--text1) !important;
}

.av-button--variant-outlined.av-button--theme-secondary {
  background-color: var(--other-background-base);
  color: var(--text1) !important;
  border: 1px solid var(--text1) !important;
}

.av-button--theme-primary:hover {
  background-color: var(--dark-background-primary1) !important;
  color: var(--other-background-base) !important;
}

.av-button--theme-secondary:hover {
  background-color: var(--light-background-neutral) !important;
}

.fr-btn.av-button--no-radius {
  border-radius: 0 !important;
}
</style>
