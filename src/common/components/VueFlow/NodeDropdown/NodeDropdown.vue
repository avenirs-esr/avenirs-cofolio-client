<script setup lang="ts">
import { Action } from '@/common/components/interaction/dropdowns/MoreActionsDropdown/MoreActionsDropdown.types'
import MoreActionsDropdown, { type MoreActionsDropdownProps } from '@/common/components/interaction/dropdowns/MoreActionsDropdown/MoreActionsDropdown.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
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

function handleItemSelected (itemName: Action) {
  switch (itemName) {
    case Action.UPDATE:
      emit('update')
      break
    case Action.DELETE:
      emit('remove')
      break
    case collapsed ? Action.EXPAND : Action.COLLAPSE:
      emit('collapse')
      break
    case Action.UPDATE_IN_PROFILE:
      withProfileUpdate && emit('updateInProfile')
      break
  }
}

const actions = computed<MoreActionsDropdownProps['actions']>(() => [
  Action.UPDATE,
  Action.DELETE,
  ...(collapsed ? [Action.EXPAND] : [Action.COLLAPSE]),
  ...(withProfileUpdate ? [Action.UPDATE_IN_PROFILE] : []),
])
</script>

<template>
  <div class="node-dropdown-container">
    <MoreActionsDropdown
      :actions="actions"
      :entity-name="t('global.vueFlow.NodeDropdown.entityName')"
      :icon="MDI_ICONS.SETTINGS"
      icon-only
      @action-selected="handleItemSelected"
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
