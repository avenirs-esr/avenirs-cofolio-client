<script setup lang="ts">
import type { AvInteractiveProps } from '@avenirs-esr/avenirs-dsav'
import type { EAssociationContextType } from '@/api/avenir-esr'
import type { ActionItem } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import { useModal } from '@avenirs-esr/shared'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ManageEntityDropdown from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.vue'
import AssociateModal from '@/features/student/associations/components/overlays/modals/AssociateModal/AssociateModal.vue'
import DeleteAssociationsModal from '@/features/student/associations/components/overlays/modals/DeleteAssociationsModal/DeleteAssociationsModal.vue'

export interface ManageAssociableEntityDropdownProps {
  entityName: string
  contextType: EAssociationContextType
  elementId: string
  actions?: (Action | ActionItem)[]
  associationInteractiveProps?: AvInteractiveProps
  dissociationInteractiveProps?: AvInteractiveProps
}

const {
  actions: propsActions = [],
  associationInteractiveProps = {},
  dissociationInteractiveProps = {}
} = defineProps<ManageAssociableEntityDropdownProps>()

const emit = defineEmits<{
  (e: AllowedActions): void
}>()

type AllowedActions = Omit<Action, Action.ASSOCIATE | Action.DISSOCIATE>

const {
  modalOpened: associateModalOpened,
  openModal: openAssociateModal,
  closeModal: closeAssociateModal
} = useModal()
const {
  modalOpened: dissociateModalOpened,
  openModal: openDissociateModal,
  closeModal: closeDissociateModal
} = useModal()

const associateAction = computed<ActionItem>(() => ({
  type: Action.ASSOCIATE,
  ...associationInteractiveProps
}))

const dissociateAction = computed<ActionItem>(() => ({
  type: Action.DISSOCIATE,
  ...dissociationInteractiveProps
}))

const actions = computed<(Action | ActionItem)[]>(() => [...propsActions, associateAction.value, dissociateAction.value])

function onActionSelected (action: Action) {
  switch (action) {
    case Action.ASSOCIATE:
      openAssociateModal()
      break
    case Action.DISSOCIATE:
      openDissociateModal()
      break
    default:
      emit(action as AllowedActions)
  }
}
</script>

<template>
  <ManageEntityDropdown
    :actions="actions"
    :entity-name="entityName"
    width="max-content"
    @action-selected="onActionSelected"
  />

  <AssociateModal
    :opened="associateModalOpened"
    :context-type="contextType"
    :element-id="elementId"
    @cancel="closeAssociateModal"
    @associated="closeAssociateModal"
  />

  <DeleteAssociationsModal
    :opened="dissociateModalOpened"
    :context-type="contextType"
    :element-id="elementId"
    @cancel="closeDissociateModal"
    @deleted="closeDissociateModal"
  />
</template>
