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

const VIconScaleRemRatio = 16 / 19.19
const scale = computed(() => VIconScaleRemRatio * propSize)
const size = computed(() => `${propSize}rem`)
</script>

<template>
  <div class="av-icon-vicon--container">
    <VIcon
      class="icon-text--icon"
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
