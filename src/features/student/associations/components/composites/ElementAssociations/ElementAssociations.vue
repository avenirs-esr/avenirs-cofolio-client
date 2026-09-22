<script setup lang="ts">
import type { AssociationsDTO, EAssociationContextType } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { AssociationLimits } from '@/features/student/associations/types/associations.types'
import type { Slot } from 'vue'
import { QuerySuspense } from '@/common/components'
import AssociatedElementsCard from '@/features/student/associations/components/cards/AssociatedElementsCard/AssociatedElementsCard.vue'
import AssociationElementsDropdown, { type AssociationElementsDropdownItem }
  from '@/features/student/associations/components/interactions/AssociationElementsDropdown/AssociationElementsDropdown.vue'
import AssociateModal from '@/features/student/associations/components/overlays/modals/AssociateModal/AssociateModal.vue'
import DeleteAssociationsModal from '@/features/student/associations/components/overlays/modals/DeleteAssociationsModal/DeleteAssociationsModal.vue'
import { EMPTY_ASSOCIATIONS } from '@/features/student/associations/constants/associations.constants'
import {
  canAssociateContextType,
  countAssociations,
  getAssociableContextTypes,
  getContextTypeSlug,
  isAssociationLimitReached
} from '@/features/student/associations/utils/associations.utils'
import { useI18n } from 'vue-i18n'

type AssociationAction = 'associate' | 'unassociate'

export interface ElementAssociationsProps {
  /** Context type of the element whose associations are displayed. */
  contextType: EAssociationContextType
  elementId: string
  associations: AssociationsDTO | undefined
  error?: BaseApiException | null
  isLoading?: boolean
  /** Context types of the associations to display and manage, all the associable ones by default. */
  associatedContextTypes?: EAssociationContextType[]
  /** Maximum number of associations per context type, an association disabled when its limit is 0. */
  limits?: AssociationLimits
  /** Hides the association actions and disables the associated elements. */
  readonly?: boolean
  /** Disables the association actions. */
  actionsDisabled?: boolean
}

const {
  contextType,
  elementId,
  associations,
  error,
  isLoading = false,
  associatedContextTypes,
  limits,
  readonly = false,
  actionsDisabled = false
} = defineProps<ElementAssociationsProps>()

defineSlots<{
  /** Displayed below the association actions. */
  'actions-footer'?: Slot
  /** Displayed above the associated elements. */
  'header'?: Slot
}>()

const { t } = useI18n()

const openedModal = ref<{ action: AssociationAction, associatedContextType: EAssociationContextType }>()

const displayedContextTypes = computed(() => associatedContextTypes ?? getAssociableContextTypes(contextType))
const elementAssociations = computed(() => associations ?? EMPTY_ASSOCIATIONS)
const slug = computed(() => getContextTypeSlug(contextType))

const countAll = computed(() => countAssociations(associations, displayedContextTypes.value))

function count (associatedContextType: EAssociationContextType) {
  return countAssociations(associations, [associatedContextType])
}

function isDisabled (associatedContextType: EAssociationContextType) {
  return limits?.[associatedContextType] === 0
}

const associateItems = computed(() => displayedContextTypes.value.filter(canAssociateContextType).map(associatedContextType => ({
  type: associatedContextType,
  disabled: isAssociationLimitReached(limits, associatedContextType, count(associatedContextType))
})))

const unassociateItems = computed<AssociationElementsDropdownItem[]>(() => displayedContextTypes.value.map(associatedContextType => ({
  type: associatedContextType,
  disabled: isDisabled(associatedContextType) || count(associatedContextType) === 0,
  disabledTooltip: t(`student.associations.contextTypes.${associatedContextType}.unassociateDisabledTooltip`)
})))

const isUnassociateDropdownDisabled = computed(() => actionsDisabled || unassociateItems.value.every(({ disabled }) => disabled))

function openModal (action: AssociationAction, associatedContextType: EAssociationContextType) {
  openedModal.value = { action, associatedContextType }
}

function closeModal () {
  openedModal.value = undefined
}

function isModalOpened (action: AssociationAction, associatedContextType: EAssociationContextType) {
  return openedModal.value?.action === action && openedModal.value.associatedContextType === associatedContextType
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
          @select="associatedContextType => openModal('unassociate', associatedContextType)"
        />
        <AssociationElementsDropdown
          variant="associate"
          :data-testid="`${slug}-associate-elements-dropdown`"
          :items="associateItems"
          :disabled="actionsDisabled"
          @select="associatedContextType => openModal('associate', associatedContextType)"
        />
      </div>

      <slot name="actions-footer" />
    </div>

    <slot name="header" />

    <QuerySuspense
      :error="error"
      :error-title="t(`student.associations.contextTypes.${contextType}.fetchAssociationsError`)"
      :empty-state-message="t(`student.associations.contextTypes.${contextType}.emptyAssociations`)"
      :is-empty="countAll === 0"
      :is-loading="isLoading"
    >
      <div class="av-col av-gap-md">
        <AssociatedElementsCard
          v-for="associatedContextType in displayedContextTypes"
          :key="associatedContextType"
          :associated-context-type="associatedContextType"
          :associations="elementAssociations"
          :limit="limits?.[associatedContextType]"
          :disabled="readonly"
        />
      </div>
    </QuerySuspense>
  </div>

  <template v-if="!readonly">
    <template
      v-for="associatedContextType in displayedContextTypes"
      :key="associatedContextType"
    >
      <AssociateModal
        :opened="isModalOpened('associate', associatedContextType)"
        :context-type="contextType"
        :element-id="elementId"
        :associated-context-type="associatedContextType"
        @cancel="closeModal"
        @associated="closeModal"
      />

      <DeleteAssociationsModal
        :opened="isModalOpened('unassociate', associatedContextType)"
        :context-type="contextType"
        :element-id="elementId"
        :associated-context-type="associatedContextType"
        :associations="elementAssociations"
        @cancel="closeModal"
        @deleted="closeModal"
      />
    </template>
  </template>
</template>
