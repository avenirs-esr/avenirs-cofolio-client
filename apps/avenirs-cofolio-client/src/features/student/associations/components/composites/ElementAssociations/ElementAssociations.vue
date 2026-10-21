<script setup lang="ts">
import type { Slot } from 'vue'
import type { AssociationsDTO, EAssociationContextType } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { AssociationElementsDropdownItem } from '@/features/student/associations/components/interactions/AssociationElementsDropdown/AssociationElementsDropdown.vue'
import type { AssociationLimitState } from '@/features/student/associations/composables/use-association-limit/use-association-limit'
import { useI18n } from 'vue-i18n'
import { QuerySuspense } from '@/common/components'
import { useModal } from '@/common/composables'
import AssociatedElementsCard from '@/features/student/associations/components/cards/AssociatedElementsCard/AssociatedElementsCard.vue'
import AssociationElementsDropdown from '@/features/student/associations/components/interactions/AssociationElementsDropdown/AssociationElementsDropdown.vue'
import AssociateModal from '@/features/student/associations/components/overlays/modals/AssociateModal/AssociateModal.vue'
import DeleteAssociationsModal from '@/features/student/associations/components/overlays/modals/DeleteAssociationsModal/DeleteAssociationsModal.vue'
import { useAssociationLimits } from '@/features/student/associations/composables/use-association-limit/use-association-limit'
import { EMPTY_ASSOCIATIONS } from '@/features/student/associations/constants/associations.constants'
import { countAssociations, getAssociableContextTypes, getContextTypeSlug } from '@/features/student/associations/utils/associations.utils'

export interface ElementAssociationsProps {
  /** Context type of the element whose associations are displayed. */
  contextType: EAssociationContextType
  elementId: string
  associations: AssociationsDTO | undefined
  error?: BaseApiException | null
  isLoading?: boolean
  /** Hides the association actions and disables the associated elements. */
  readonly?: boolean
  /** Disables the association actions. */
  actionsDisabled?: boolean
  /** Tooltip explaining why the association actions are disabled. */
  actionsDisabledTooltip?: string
}

const {
  contextType,
  elementId,
  associations: _associations,
  error,
  isLoading = false,
  readonly = false,
  actionsDisabled = false,
  actionsDisabledTooltip
} = defineProps<ElementAssociationsProps>()

defineSlots<{
  /** Displayed above the associated elements. */
  header?: Slot<{ getLimit: (associatedContextType: EAssociationContextType) => AssociationLimitState }>
}>()

const { t } = useI18n()

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

const selectedContextType = ref<EAssociationContextType>()

const associableContextTypes = computed(() => getAssociableContextTypes(contextType))
const associations = computed(() => _associations ?? EMPTY_ASSOCIATIONS)
const slug = computed(() => getContextTypeSlug(contextType))
const isEmpty = computed(() => countAssociations(associations.value, associableContextTypes.value) === 0)

const { getLimit, getAssociateState } = useAssociationLimits({
  contextType,
  elementId: () => elementId
})

const associateItems = computed<AssociationElementsDropdownItem[]>(() => associableContextTypes.value.map(type => ({ type, ...getAssociateState(type) })))
const unassociateItems = computed<AssociationElementsDropdownItem[]>(() => associableContextTypes.value.map((associatedContextType) => {
  const disabled = isEmpty.value || countAssociations(associations.value, [associatedContextType]) === 0
  return {
    type: associatedContextType,
    disabled,
    disabledTooltip: disabled ? t(`student.associations.contextTypes.${associatedContextType}.unassociateDisabledTooltip`) : undefined
  }
}))

const isUnassociateDropdownDisabled = computed(() => actionsDisabled || unassociateItems.value.every(({ disabled }) => disabled))
const actionsTooltip = computed(() => actionsDisabled ? actionsDisabledTooltip : undefined)

function onAssociateSelect (associatedContextType: EAssociationContextType) {
  selectedContextType.value = associatedContextType
  openAssociateModal()
}

function onUnassociateSelect (associatedContextType: EAssociationContextType) {
  selectedContextType.value = associatedContextType
  openUnassociateModal()
}
</script>

<template>
  <div
    class="av-col av-gap-xl av-pt-xl"
    :data-testid="`${slug}-associations`"
  >
    <div
      v-if="!readonly"
      class="av-col av-gap-sm"
    >
      <div class="av-row av-flex-fill av-justify-end av-gap-md">
        <AssociationElementsDropdown
          variant="delete"
          :data-testid="`delete-${slug}-associated-elements-dropdown`"
          :items="unassociateItems"
          :disabled="isUnassociateDropdownDisabled"
          :disabled-tooltip="actionsTooltip"
          @select="onUnassociateSelect"
        />
        <AssociationElementsDropdown
          variant="associate"
          :data-testid="`${slug}-associate-elements-dropdown`"
          :items="associateItems"
          :disabled="actionsDisabled"
          :disabled-tooltip="actionsTooltip"
          @select="onAssociateSelect"
        />
      </div>
    </div>

    <slot
      name="header"
      :get-limit="getLimit"
    />

    <QuerySuspense
      :error="error"
      :error-title="t(`student.associations.contextTypes.${contextType}.fetchAssociationsError`)"
      :empty-state-message="t(`student.associations.contextTypes.${contextType}.emptyAssociations`)"
      :is-empty
      :is-loading="isLoading"
    >
      <div class="av-col av-gap-md">
        <AssociatedElementsCard
          v-for="associatedContextType in associableContextTypes"
          :key="associatedContextType"
          :associated-context-type
          :associations
          :limit="getLimit(associatedContextType).max"
          :disabled="readonly"
        />
      </div>
    </QuerySuspense>
  </div>

  <template v-if="!readonly && selectedContextType">
    <AssociateModal
      :opened="associateModalOpened"
      :context-type="contextType"
      :element-id="elementId"
      :associated-context-type="selectedContextType"
      @cancel="closeAssociateModal"
      @associated="closeAssociateModal"
    />

    <DeleteAssociationsModal
      :opened="unassociateModalOpened"
      :context-type="contextType"
      :element-id="elementId"
      :associated-context-type="selectedContextType"
      :associations
      @cancel="closeUnassociateModal"
      @deleted="closeUnassociateModal"
    />
  </template>
</template>
