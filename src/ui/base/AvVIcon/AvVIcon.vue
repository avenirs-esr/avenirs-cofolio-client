<script setup lang="ts">
/**
 * AvVIcon component props.
 */
export interface AvVIconProps {
  /**
   * The size in rem of the icon container and a ratio for the icon scale.
   * @default 1
   */
  size?: number

  /**
   * The name of the icon to display.
   */
  name: string

  /**
   * Vertical alignment of the icon relative to the baseline.
   * @default '-0.2em'
   */
  verticalAlign?: string

  /**
   * Animation type applied to the icon.
   * Can be 'spin', 'wrench', 'pulse', 'spin-pulse', 'flash', or 'float'.
   */
  animation?: 'spin' | 'wrench' | 'pulse' | 'spin-pulse' | 'flash' | 'float'

  /**
   * Animation speed, if set.
   * Can be 'fast' or 'slow'.
   */
  speed?: 'fast' | 'slow'

  /**
   * Flips the icon horizontally, vertically, or both.
   */
  flip?: 'horizontal' | 'vertical' | 'both'

  /**
   * ARIA label for accessibility.
   */
  label?: string

  /**
   * Icon title (`<title>` tag), used for accessibility and tooltips.
   */
  title?: string

  /**
   * Main color of the icon.
   */
  color?: string

  /**
   * Applies an inverted color to the icon.
   * @default false
   */
  inverse?: boolean

  /**
   * Enables server-side rendering.
   * @default true
   */
  ssr?: boolean
}

const { size: propSize = 1, ...props } = defineProps<AvVIconProps>()

const VICON_SCALE_REM_RATIO = 16 / 19.19
const scale = computed(() => VICON_SCALE_REM_RATIO * propSize)
const size = computed(() => `${propSize}rem`)
</script>

<template>
  <div class="av-icon-vicon--container">
    <VIcon
      v-bind="props"
      :scale="scale"
    />
  </div>
</template>

<style lang="scss" scoped>
.av-icon-vicon--container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: v-bind('size');
  height: v-bind('size');
}
</style>
