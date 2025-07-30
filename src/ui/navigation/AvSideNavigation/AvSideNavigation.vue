<script setup lang="ts">
import { AvList, AvListItem, AvSideMenu } from '@/ui'

export interface AvSideNavigationItem {
  id: string
  label: string
  icon: string
}

export interface AvSideNavigationProps {
  /**
   * List of items to display in the side navigation.
   */
  items: AvSideNavigationItem[]
  /**
   * The currently selected item ID.
   */
  selectedItem?: string
  /**
   * Whether the side menu is collapsed or not.
   */
  isSideMenuCollapsed?: boolean
  /**
   * Width of the side menu when collapsed.
   */
  collapsedWidth?: string
}

withDefaults(defineProps<AvSideNavigationProps>(), {
  collapsedWidth: '3.5rem'
})

/**
 * Events emitted by the component.
 */
defineEmits<{
  /**
   * Emitted when the selected item changes.
   * @param value - The ID of the newly selected item
   */
  'update:selectedItem': [value: string]
  /**
   * Emitted when the side menu collapse state changes.
   * @param value - New collapsed state (true for collapsed, false for expanded)
   */
  'update:isSideMenuCollapsed': [value: boolean]
}>()

const selectedItem = defineModel<string>('selectedItem', {
  default: ''
})

const isSideMenuCollapsed = defineModel<boolean>('isSideMenuCollapsed', {
  default: false
})

function handleSelectItem (itemId: string) {
  selectedItem.value = itemId
}
</script>

<template>
  <AvSideMenu
    v-model:collapsed="isSideMenuCollapsed"
    :collapsed-width="collapsedWidth"
  >
    <AvList
      size="small"
      role="menu"
    >
      <AvListItem
        v-for="item in items"
        :key="item.id"
        :title="isSideMenuCollapsed ? undefined : item.label"
        :icon="item.icon"
        :icon-size="1.8"
        :selected="selectedItem === item.id"
        tag="button"
        role="menuitem"
        class="av-side-navigation__menu-item"
        :class="{
          'av-side-navigation__menu-item--collapsed': isSideMenuCollapsed,
        }"
        clickable
        @click="handleSelectItem(item.id)"
      />
    </AvList>
  </AvSideMenu>
</template>

<style lang="scss" scoped>
.av-side-navigation__menu-item {
  border-radius: var(--radius-xl) 0 0 var(--radius-xl);

  &--collapsed {
    justify-content: center;

    :deep(.av-list-item__content) {
      display: none;
    }
  }
}
</style>
