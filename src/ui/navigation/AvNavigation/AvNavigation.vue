<script setup lang="ts">
import type { DsfrNavigationProps } from '@gouvminint/vue-dsfr'

export interface AvNavigationProps {
  navItems: DsfrNavigationProps['navItems']
}

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

.my-nav-wrapper :deep(.fr-nav__item > .fr-nav__btn),
.my-nav-wrapper :deep(.fr-nav__item > .fr-nav__link) {
  border-radius: 1.5rem 1.5rem 0 0;
}

.my-nav-wrapper :deep(.fr-nav__item > .fr-collapse > .fr-menu__list > .fr-menu__item > .fr-nav__link:hover) {
  border-radius: 0;
}
</style>
