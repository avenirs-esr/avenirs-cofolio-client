<script lang="ts" setup>
import type { ToolDTO } from '#shared/api/avenir-esr/index'
import type { AvInteractiveProps } from '@avenirs-esr/avenirs-dsav'
import { useModal } from '#shared/composables/index'
import { Action } from '#shared/ui/components/interactions/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ManageEntityDropdown from '#shared/ui/components/interactions/dropdowns/ManageEntityDropdown/ManageEntityDropdown.vue'
import DeleteToolModal from '#shared/ui/components/overlay/modals/DeleteToolModal/DeleteToolModal.vue'
import { useI18n } from 'vue-i18n'

export interface ManageToolDropdownProps extends AvInteractiveProps {
  tool: ToolDTO
}

const { tool, ...avInteractiveProps } = defineProps<ManageToolDropdownProps>()

const emit = defineEmits<{
  (e: 'deleted'): void
}>()

const { modalOpened, openModal, closeModal } = useModal()
const { t } = useI18n()

const actions = [Action.DELETE]

const i18nKey = 'global.components.interactions.dropdowns.ManageToolDropdown'

function onActionSelected (action: Action) {
  if (action === Action.DELETE) {
    openModal()
  }
}

function onDeleted () {
  emit('deleted')
  closeModal()
}
</script>

<template>
  <ManageEntityDropdown
    v-bind="avInteractiveProps"
    :actions
    :entity-name="t(`${i18nKey}.entityName.${tool.type}`)"
    @action-selected="onActionSelected"
  />
  <DeleteToolModal
    :opened="modalOpened"
    :tool="tool"
    @cancel="closeModal"
    @deleted="onDeleted"
  />
</template>
