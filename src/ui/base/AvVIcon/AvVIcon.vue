<script setup lang="ts">
import type { VIconProps } from '@gouvminint/vue-dsfr'

type AvVIConProps = { size: number } & Omit<VIconProps, 'scale'>

const props = defineProps<AvVIConProps>()

const VIconScaleRemRatio = 16 / 19.19
const scale = computed(() => VIconScaleRemRatio * props.size)
const size = computed(() => `${props.size}rem`)
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
  width: v-bind('size');
  height: v-bind('size');
}
</style>
