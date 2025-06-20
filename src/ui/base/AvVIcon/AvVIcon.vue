<script setup lang="ts">
import type { VIconProps } from '@gouvminint/vue-dsfr'

/**
 * Props for AvVIcon component.
 */
type AvVIConProps = {
  /**
   * Size of the icon in `rem`.
   * Defaults to 1rem.
   */
  size?: number
} & Omit<VIconProps, 'scale'>

const { size: propSize = 1, ...props } = defineProps<AvVIConProps>()

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
