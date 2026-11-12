<script setup lang="ts">
import type { EAssociationContextType } from '@avenirs-esr/shared/api/avenir-esr'
import type { DisabledState } from '@/common/components/interaction/dropdowns/ManageAssociableEntityDropdown/ManageAssociableEntityDropdown.types'
import type { ActionItem } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import { useModal } from '@avenirs-esr/shared'
import { useI18n } from 'vue-i18n'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import { getAssociableContextTypes } from '@/features/student/associations'
import AssociateModal from '@/features/student/associations/components/overlays/modals/AssociateModal/AssociateModal.vue'
import DeleteAssociationsModal from '@/features/student/associations/components/overlays/modals/DeleteAssociationsModal/DeleteAssociationsModal.vue'
import { useAssociationLimits } from '@/features/student/associations/composables/use-association-limit/use-association-limit'

export interface ManageAssociableEntityDropdownProps {
  elementId: string
  entityName?: string
  contextType: EAssociationContextType
  hasAssociations: boolean
  associateOverride?: DisabledState
}

const {
  contextType,
  elementId,
  hasAssociations,
  associateOverride,

} = defineProps<ManageAssociableEntityDropdownProps>()

const { t } = useI18n()

const { getAssociateState } = useAssociationLimits({
  contextType,
  elementId: () => elementId
})

const {
  modalOpened: associateModalOpened,
  openModal: openAssociateModal,
  closeModal: closeAssociateModal
} = useModal()

const {
  modalOpened: unassociateModalOpened,
  openModal: openUnassociateModal,
  closeModal: closeUnassociateModal
} = useModal()

const associableContextTypes = computed(() => getAssociableContextTypes(contextType))

const associateLimitState = computed<DisabledState>(() => {
  const canAssociate = associableContextTypes.value
    .some(type => !getAssociateState(type).disabled)

  if (canAssociate) {
    return {
      disabled: false
    }
  }
  return {
    disabled: true,
    disabledTooltip: t(`student.associations.contextTypes.${contextType}.associateDisabledTooltip`)
  }
})

const associateAction = computed<ActionItem>(() => {
  const limit = associateLimitState.value
  const disabled = (associateOverride?.disabled ?? false) || limit.disabled

  const disabledTooltip = associateOverride?.disabled
    ? associateOverride.disabledTooltip
    : limit.disabledTooltip

  return {
    type: Action.ASSOCIATE,
    disabled,
    disabledTooltip
  }
})

const dissociateAction = computed<ActionItem>(() => {
  const disabled = !hasAssociations

  return {
    type: Action.DISSOCIATE,
    disabled,
    disabledTooltip: disabled
      ? t(`student.associations.contextTypes.${contextType}.dissociateDisabledTooltip`)
      : undefined
  }
})

function handleAction (action: Action) {
  if (action === Action.ASSOCIATE) {
    openAssociateModal()
  }
  else if (action === Action.DISSOCIATE) {
    openUnassociateModal()
  }
}
</script>

<template>
  <slot
    :associate-action="associateAction"
    :dissociate-action="dissociateAction"
    :handle-action="handleAction"
  />

  <AssociateModal
    v-if="associateModalOpened"
    :opened="associateModalOpened"
    :context-type="contextType"
    :element-id="elementId"
    @cancel="closeAssociateModal"
    @associated="closeAssociateModal"
  />

  <DeleteAssociationsModal
    v-if="unassociateModalOpened"
    :opened="unassociateModalOpened"
    :context-type="contextType"
    :element-id="elementId"
    @cancel="closeUnassociateModal"
    @deleted="closeUnassociateModal"
  />
</template>
