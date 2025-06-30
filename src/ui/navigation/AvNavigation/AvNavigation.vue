<script setup lang="ts">
import type {
  DsfrNavigationMegaMenuProps,
  DsfrNavigationMenuLinkProps,
  DsfrNavigationMenuProps
} from '@gouvminint/vue-dsfr'

/**
 * Props du composant AvNavigation.
 */
export interface AvNavigationProps {
  /**
   * Liste des items de navigation.
   * Chaque item peut être :
   * - Un lien direct de navigation (`DsfrNavigationMenuLinkProps`) avec les props `to` et `text`.
   * - Un sous-menu de navigation (`DsfrNavigationMenuProps`) avec les props `title`, `links` et `active`.
   * - Un mega-menu de navigation (`DsfrNavigationMegaMenuProps`) avec les props `title`, `link`, `active` et `menus`.
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
