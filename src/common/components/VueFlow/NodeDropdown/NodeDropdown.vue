<script setup lang="ts">
import { AvDropdown, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

/**
 * Props for the NodeDropdown component.
 */
export interface NodeDropdownProps {
  /**
   * Indicates whether the children of the node are collapsed.
   */
  collapsed?: boolean

  /**
   * Indicates whether the dropdown includes the option to update the node in the user's profile.
   * @default false
   */
  withProfileUpdate?: boolean
}

const { collapsed, withProfileUpdate = false } = defineProps<NodeDropdownProps>()

/**
 * Emits events related to node dropdown actions.
 * @emits update - When the user wants to update the structure of the node (e.g., its handles).
 * @emits remove - When the user wants to remove the node.
 * @emits collapse - When the user wants to collapse or expand the children of the node.
 * @emits updateInProfile - When the user wants to update the node in their profile and save the data in the API.
 */
const emit = defineEmits<{
  /**
   * Emitted when the user wants to update the structure of the node (e.g., its handles).
   */
  (e: 'update'): void

  /**
   * Emitted when the user wants to remove the node.
   */
  (e: 'remove'): void

  /**
   * Emitted when the user wants to collapse or expand the children of the node.
   */
  (e: 'collapse'): void

  /**
   * Emitted when the user wants to update the node in their profile and save the data in the API.
   * Can only be emitted if `withProfileUpdate` prop is true.
   */
  (e: 'updateInProfile'): void
}>()

const { t } = useI18n()

enum NodeDropdownEvents {
  UPDATE = 'update',
  REMOVE = 'remove',
  COLLAPSE = 'collapse',
  UPDATE_IN_PROFILE = 'updateInProfile',
}

const menuItems = computed(() => [
  {
    name: NodeDropdownEvents.UPDATE,
    icon: MDI_ICONS.PENCIL_OUTLINE,
    label: t('global.buttons.update')
  },
  {
    name: NodeDropdownEvents.REMOVE,
    icon: MDI_ICONS.TRASH_CAN_OUTLINE,
    label: t('global.buttons.delete')
  },
  {
    name: NodeDropdownEvents.COLLAPSE,
    icon: collapsed ? MDI_ICONS.PLUS : MDI_ICONS.MINUS,
    label: collapsed ? t('global.buttons.expand') : t('global.buttons.collapse'),
  },
  ...(withProfileUpdate
    ? [{
        name: NodeDropdownEvents.UPDATE_IN_PROFILE,
        icon: MDI_ICONS.TRAY_UPLOAD,
        label: t('global.vueFlow.NodeDropdown.updateInProfile')
      }]
    : []),
])

function handleItemSelected (itemName: string) {
  switch (itemName) {
    case NodeDropdownEvents.UPDATE:
      emit('update')
      break
    case NodeDropdownEvents.REMOVE:
      emit('remove')
      break
    case NodeDropdownEvents.COLLAPSE:
      emit('collapse')
      break
    case NodeDropdownEvents.UPDATE_IN_PROFILE:
      withProfileUpdate && emit('updateInProfile')
      break
  }
}
</script>

<template>
  <div class="node-dropdown-container">
    <AvDropdown
      :items="menuItems"
      trigger-aria-label="Paramètres du noeud lien"
      :trigger-icon="MDI_ICONS.SETTINGS"
      trigger-small
      width="max-content"
      @item-selected="handleItemSelected"
    />
  </div>
</template>

<style lang="scss" scoped>
.node-dropdown-container {
  position: absolute;
  top: -1.75rem;
  right: var(--spacing-none);
}
</style>
