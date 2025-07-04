<script setup lang="ts">
import type {
  DsfrNavigationMegaMenuProps,
  DsfrNavigationMenuLinkProps,
  DsfrNavigationMenuProps
} from '@gouvminint/vue-dsfr'

/**
 * AvNavigation component props.
 */
export interface AvNavigationProps {
  /**
   * List of navigation items.
   * Each item can be:
   * - A direct navigation link (`DsfrNavigationMenuLinkProps`) with `to` and `text` props.
   * - A navigation submenu (`DsfrNavigationMenuProps`) with `title`, `links` and `active` props.
   * - A mega-navigation menu (`DsfrNavigationMegaMenuProps`) with `title`, `link`, `active` and `menus` props.
   */
  navItems: (DsfrNavigationMenuLinkProps | DsfrNavigationMenuProps | DsfrNavigationMegaMenuProps)[]
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
