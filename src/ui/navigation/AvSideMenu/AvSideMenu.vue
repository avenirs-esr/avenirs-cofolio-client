<script setup lang="ts">
import type { Slot } from 'vue'
import { AvButton } from '@/ui'
import { MDI_ICONS } from '@/ui/tokens/icons'

export interface AvSideMenuProps {
  /**
   * Unique identifier for the side-menu
   */
  id?: string
  /**
   * Whether the collapsing feature is enabled
   */
  collapsible?: boolean
  /**
   * Whether the side-menu is collapsed (for v-model usage)
   * @default false
   */
  collapsed?: boolean
  /**
   * Width of the side-menu when expanded
   */
  width?: string
  /**
   * Width of the side-menu when collapsed
   */
  collapsedWidth?: string

  /**
   * Custom padding for the side-menu content
   */
  padding?: string
}

const props = withDefaults(defineProps<AvSideMenuProps>(), {
  collapsible: true,
  collapsed: false,
  width: '16rem',
  collapsedWidth: '5rem',
  padding: '0'
})

/**
 * Events emitted by the component.
 */
defineEmits<{
  /**
   * Emitted when collapsed state changes.
   * @param value Value (boolean`) - New collapsed state
   */
  'update:collapsed': [value: boolean]
}>()

/**
 * Slots available for the component.
 *
 * @slot title - Slot for custom title content.
 * @slot default - Slot for custom content (menu items, etc.).
 */
defineSlots<{
  /**
   * Slot for custom content (menu items, etc.)
   */
  default?: () => Slot
}>()

const collapsed = defineModel<boolean>('collapsed', { default: false })

const { width, collapsedWidth } = toRefs(props)
const menuId = computed(() => props.id ?? crypto.randomUUID())
const ariaLabel = computed(() => `${menuId.value} navigation`)

const isCollapsed = computed({
  get: () => {
    if (!props.collapsible) {
      return false
    }
    return collapsed.value
  },
  set: (value) => {
    if (!props.collapsible) {
      return
    }
    collapsed.value = value
  }
})

const currentWidth = computed(() => {
  return (props.collapsible && isCollapsed.value) ? collapsedWidth.value : width.value
})

function toggleCollapse () {
  if (props.collapsible) {
    isCollapsed.value = !isCollapsed.value
  }
}
</script>

<template>
  <nav
    :id="menuId"
    class="av-side-menu"
    :class="{ 'av-side-menu--collapsed': isCollapsed }"
    :aria-label="ariaLabel"
  >
    <div
      v-if="props.collapsible"
      class="av-side-menu__header"
    >
      <AvButton
        :aria-expanded="!isCollapsed"
        :aria-controls="menuId"
        :icon="isCollapsed ? MDI_ICONS.CHEVRON_DOUBLE_RIGHT : MDI_ICONS.CHEVRON_DOUBLE_LEFT"
        class="av-side-menu__collapse-button"
        :label="isCollapsed ? `${menuId}-expand-button` : `${menuId}-collapse-button`"
        icon-only
        @click="toggleCollapse"
      />
    </div>

    <div class="av-side-menu__content">
      <slot />
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.av-side-menu {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: v-bind('currentWidth');
  background-color: var(--other-background-base);
  transition: width 0.3s ease;
  border-right: 1px solid var(--stroke);
  padding: v-bind('padding');
}

.av-side-menu__header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-height: var(--dimension-4xl);
}

.av-side-menu__content {
  display: flex;
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-sm) 0;
}

.av-side-menu__collapse-button {
  padding: var(--spacing-xs);
  gap: 0;
  min-height: var(--dimension-lg);
}
</style>
