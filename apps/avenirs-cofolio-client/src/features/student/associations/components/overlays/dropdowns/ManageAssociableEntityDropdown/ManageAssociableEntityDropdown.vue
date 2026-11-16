<script setup lang="ts">
import type { AvInteractiveProps } from '@avenirs-esr/avenirs-dsav'
import type { EAssociationContextType } from '@avenirs-esr/shared/api/avenir-esr'
import type { ActionItem } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import { useModal } from '@avenirs-esr/shared'
import { useGetAssociations } from '@avenirs-esr/shared/api/avenir-esr'
import { useI18n } from 'vue-i18n'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ManageEntityDropdown from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.vue'
import ManageAssociationModal from '@/features/student/associations/components/overlays/modals/ManageAssociationModal/ManageAssociationModal.vue'
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
const { getAssociateState } = useAssociationLimits({ contextType, elementId: () => elementId })
const { data: associations } = useGetAssociations(contextType, computed(() => elementId), undefined, {
  query: { enabled: computed(() => !!elementId) }
})
const { modalOpened, openModal, closeModal } = useModal()

const mode = ref<Action.ASSOCIATE | Action.DISSOCIATE>(Action.ASSOCIATE)

const associableContextTypes = computed(() => getAssociableContextTypes(contextType)
  .filter(type => type !== contextType))
const allLimitsReached = computed(() =>
  associableContextTypes.value.length > 0
  && associableContextTypes.value.every(type => getAssociateState(type).disabled)
)
const hasNoAssociations = computed(() =>
  associations.value !== undefined && countAssociations(associations.value, associableContextTypes.value) === 0
)

const disableTooltipsKey = 'student.associations.overlays.dropdowns.ManageAssociableEntityDropdown.disabledTooltips'

const associateActionDisabledTooltip = computed(() => {
  if (associationInteractiveProps.disabled) {
    return associationInteractiveProps.disabledTooltip
  }

  if (allLimitsReached.value) {
    return t(`${disableTooltipsKey}.fullAssociations`, {
      entityName: t(`${disableTooltipsKey}.entityName.${contextType}`)
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
    return t(`${disableTooltipsKey}.emptyAssociations`, {
      entityName: t(`${disableTooltipsKey}.entityName.${contextType}`)
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

const actions = computed<(Action | ActionItem)[]>(() => [
  ...propsActions,
  associateAction.value,
  dissociateAction.value
])

function onActionSelected (action: Action) {
  switch (action) {
    case Action.ASSOCIATE:
      mode.value = Action.ASSOCIATE
      openModal()
      break
    case Action.DISSOCIATE:
      mode.value = Action.DISSOCIATE
      openModal()
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

  <ManageAssociationModal
    :opened="modalOpened"
    :context-type="contextType"
    :element-id="elementId"
    :mode="mode"
    @cancel="closeModal"
    @associated="closeModal"
    @dissociated="closeModal"
  />
</template>
