<script setup lang="ts">
import type { AvNavigationProps } from './types'

const props = defineProps<AvNavigationProps>()
</script>

<template>
  <div
    style="position: relative"
    class="my-nav-wrapper"
  >
    <DsfrNavigation v-bind="props" />
  </div>
</template>

<style lang="scss" scoped>
.my-nav-wrapper :deep(.fr-nav__link) {
  display: flex;
  gap: 1rem;
  justify-content: flex-start;
}

.my-nav-wrapper :deep(.vicon) {
  scale: 0.75;
}
</style>
