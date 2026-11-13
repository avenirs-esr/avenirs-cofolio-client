<script setup lang="ts">
import type { AvInteractiveProps } from '@avenirs-esr/avenirs-dsav'
import type { EAssociationContextType } from '@avenirs-esr/shared/api/avenir-esr'
import type { ActionItem } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import { useModal } from '@avenirs-esr/shared'
import { useGetAssociations } from '@avenirs-esr/shared/api/avenir-esr'
import { useI18n } from 'vue-i18n'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ManageEntityDropdown from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.vue'
import AssociateModal from '@/features/student/associations/components/overlays/modals/AssociateModal/AssociateModal.vue'
import DeleteAssociationsModal from '@/features/student/associations/components/overlays/modals/DeleteAssociationsModal/DeleteAssociationsModal.vue'
import { useAssociationLimits } from '@/features/student/associations/composables/use-association-limit/use-association-limit'
import { countAssociations, getAssociableContextTypes } from '@/features/student/associations/utils/associations.utils'

export interface ManageAssociableEntityDropdownProps {
  actions?: (Action | ActionItem)[]
  entityName: string
  contextType: EAssociationContextType
  elementId: string
  associationInteractiveProps?: AvInteractiveProps
  dissociationInteractiveProps?: AvInteractiveProps
}

const {
  actions: propsActions = [],
  contextType,
  elementId,
  associationInteractiveProps = {},
  dissociationInteractiveProps = {}
} = defineProps<ManageAssociableEntityDropdownProps>()

const emit = defineEmits<{
  (e: AllowedActions): void
}>()

type AllowedActions = Omit<Action, Action.ASSOCIATE | Action.DISSOCIATE>

const { t } = useI18n()
const associableContextTypes = computed(() => getAssociableContextTypes(contextType).filter(type => type !== contextType))
const { getAssociateState } = useAssociationLimits({ contextType, elementId: () => elementId })
const { data: associations } = useGetAssociations(contextType, computed(() => elementId), undefined, {
  query: { enabled: computed(() => !!elementId) }
})

const allLimitsReached = computed(() =>
  associableContextTypes.value.length > 0
  && associableContextTypes.value.every(type => getAssociateState(type).disabled)
)
const hasNoAssociations = computed(() =>
  associations.value !== undefined && countAssociations(associations.value, associableContextTypes.value) === 0
)

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

const associateActionDisabledTooltip = computed(() => {
  if (associationInteractiveProps.disabled) {
    return associationInteractiveProps.disabledTooltip
  }

  if (allLimitsReached.value) {
    return t('student.associations.overlays.dropdowns.ManageAssociableEntityDropdown.disabledTooltips.fullAssociations', {
      entityName: t(`student.associations.overlays.dropdowns.ManageAssociableEntityDropdown.disabledTooltips.entityName.${contextType}`)
    })
  }

  return associationInteractiveProps.disabledTooltip
})

const associateAction = computed<ActionItem>(() => ({
  type: Action.ASSOCIATE,
  ...associationInteractiveProps,
  disabled: !!associationInteractiveProps.disabled || allLimitsReached.value,
  disabledTooltip: associateActionDisabledTooltip.value
}))

const dissociateActionDisabledTooltip = computed(() => {
  if (dissociationInteractiveProps.disabled) {
    return dissociationInteractiveProps.disabledTooltip
  }

  if (hasNoAssociations.value) {
    return t('student.associations.overlays.dropdowns.ManageAssociableEntityDropdown.disabledTooltips.emptyAssociations', {
      entityName: t(`student.associations.overlays.dropdowns.ManageAssociableEntityDropdown.disabledTooltips.entityName.${contextType}`)
    })
  }

  return dissociationInteractiveProps.disabledTooltip
})

const dissociateAction = computed<ActionItem>(() => ({
  type: Action.DISSOCIATE,
  ...dissociationInteractiveProps,
  disabled: !!dissociationInteractiveProps.disabled || hasNoAssociations.value,
  disabledTooltip: dissociateActionDisabledTooltip.value
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
    v-bind="$attrs"
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
