<script lang="ts" setup>
import type { ActionItem } from '#shared/ui/components/interactions/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import type { AvInteractiveProps } from '@avenirs-esr/avenirs-dsav'
import { useModal } from '#shared/composables/index'
import { Action } from '#shared/ui/components/interactions/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ManageEntityDropdown from '#shared/ui/components/interactions/dropdowns/ManageEntityDropdown/ManageEntityDropdown.vue'
import AddToolDrawer from '#shared/ui/components/overlay/drawers/AddToolDrawer/AddToolDrawer.vue'
import DeleteToolsModal from '#shared/ui/components/overlay/modals/DeleteToolsModal/DeleteToolsModal.vue'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export interface ManageToolsDropdownProps {
  isNational?: boolean
  entityName?: string
  addInteractiveProps?: AvInteractiveProps
  deleteInteractiveProps?: AvInteractiveProps
}

const {
  isNational = false,
  entityName,
  addInteractiveProps,
  deleteInteractiveProps
} = defineProps<ManageToolsDropdownProps>()

const { modalOpened, openModal, closeModal } = useModal()
const { t } = useI18n()

const showAddToolDrawer = ref(false)

const actions = computed<ActionItem[]>(() => [
  { type: Action.ADD, ...addInteractiveProps },
  { type: Action.DELETE, ...deleteInteractiveProps }
])

const resolvedEntityName = computed(() => entityName ?? t('global.components.interactions.dropdowns.ManageToolsDropdown.entityName'))

function onActionSelected (action: Action) {
  if (action === Action.ADD) {
    showAddToolDrawer.value = true
  }
  if (action === Action.DELETE) {
    openModal()
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
  <DeleteToolsModal
    :opened="modalOpened"
    :is-national="isNational"
    @cancel="closeModal"
    @deleted="closeModal"
  />
</template>
