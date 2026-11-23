<script lang="ts" setup>
import { Action } from '#shared/ui/components/interactions/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ManageEntityDropdown from '#shared/ui/components/interactions/dropdowns/ManageEntityDropdown/ManageEntityDropdown.vue'
import AddToolDrawer from '#shared/ui/components/overlay/drawers/AddToolDrawer/AddToolDrawer.vue'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export interface ManageToolsDropdownProps {
  isNational?: boolean
  entityName?: string
}

const { isNational = false, entityName } = defineProps<ManageToolsDropdownProps>()

const { t } = useI18n()

const actions = [Action.ADD]

const showAddToolDrawer = ref(false)

const resolvedEntityName = computed(() => entityName ?? t('global.components.interactions.dropdowns.ManageToolsDropdown.entityName'))

function onActionSelected (action: Action) {
  if (action === Action.ADD) {
    showAddToolDrawer.value = true
  }
}
</script>

<template>
  <ManageEntityDropdown
    :actions
    :entity-name="resolvedEntityName"
    @action-selected="onActionSelected"
  />
  <AddToolDrawer
    :show="showAddToolDrawer"
    :is-national
    @close="showAddToolDrawer = false"
  />
</template>
