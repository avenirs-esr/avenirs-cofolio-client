<script lang="ts" setup>
import type { AvAutocompleteOption } from '@avenirs-esr/avenirs-dsav'
import type { Association } from '@/features/student/associations/types/associations.types'
import { ConfirmationModal, ICONS, QuerySuspense, useModal, useTaskLoading, useToasterStore } from '@avenirs-esr/shared'
import { EAssociationContextType, useGetAssociations } from '@avenirs-esr/shared/api/avenir-esr'
import { useI18n } from 'vue-i18n'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import AssociationCompactCard from '@/features/student/associations/components/cards/AssociationCompactCard/AssociationCompactCard.vue'
import AssociationContextTypeSelect from '@/features/student/associations/components/interactions/AssociationContextTypeSelect/AssociationContextTypeSelect.vue'
import AssociationSearchFilterSelect from '@/features/student/associations/components/interactions/AssociationSearchFilterSelect/AssociationSearchFilterSelect.vue'
import AssociationsSelector from '@/features/student/associations/components/interactions/AssociationsSelector/AssociationsSelector.vue'
import SearchAssociationLayout from '@/features/student/associations/components/interactions/SearchAssociationLayout/SearchAssociationLayout.vue'
import ConfirmManageAssociationModal from '@/features/student/associations/components/overlays/modals/ConfirmManageAssociationModal/ConfirmManageAssociationModal.vue'
import { useAssociationLimits } from '@/features/student/associations/composables/use-association-limit/use-association-limit'
import { useAssociationMutations } from '@/features/student/associations/composables/use-association-mutations/use-association-mutations'
import { useAssociationSearch } from '@/features/student/associations/composables/use-association-search/use-association-search'
import { useDissociationState } from '@/features/student/associations/composables/use-dissociation-state/use-dissociation-state'
import { DEFAULT_ASSOCIATION_SEARCH_FILTER } from '@/features/student/associations/constants/associations.constants'
import { countAssociations, getAssociableContextTypes, getContextTypeSlug, getElementAssociations } from '@/features/student/associations/utils/associations.utils'

type AssociationOption = AvAutocompleteOption & Pick<Association, 'category' | 'contextType'>

export interface ManageAssociationModalProps {
  opened: boolean
  /** Context type of the element to associate or dissociate. */
  contextType: EAssociationContextType
  /** Id of the element to associate or dissociate. */
  elementId: string
  /** Mode of the association action. */
  mode: Action.ASSOCIATE | Action.DISSOCIATE
}

const { opened, contextType, elementId, mode } = defineProps<ManageAssociationModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'associated'): void
  (e: 'dissociated'): void
}>()

const { t } = useI18n()
const { modalOpened, openModal, closeModal } = useModal()
const { withTaskLoading, isLoading: isTaskLoading } = useTaskLoading()
const { associateAsync, unassociateAsync, isPending } = useAssociationMutations()
const { addErrorMessage, addSuccessMessage } = useToasterStore()

const { getAssociateState } = useAssociationLimits({
  contextType,
  elementId: () => elementId,
  enabled: computed(() => mode === Action.ASSOCIATE)
})
const { getDissociationState } = useDissociationState()

const { data: dissociableAssociations, isLoading: isAssociationsLoading, error: associationsError } = useGetAssociations(contextType, computed(() => elementId), undefined, {
  query: {
    enabled: computed(() => !!elementId && mode === Action.DISSOCIATE)
  }
})

const selectedType = ref<EAssociationContextType | null>()
const selectedOptions = ref<AssociationOption[]>([])

const {
  searchQuery,
  searchFilter,
  isFilterable,
  associations: associableAssociations,
  isLoading: isSearchLoading
} = useAssociationSearch({
  contextType,
  elementId: () => elementId,
  associatedContextType: () => selectedType.value as EAssociationContextType,
  selectedIds: () => selectedOptions.value.map(({ value }) => value.toString()),
  enabled: () => opened && !!selectedType.value && mode === Action.ASSOCIATE
})

const currentTypeDissociableAssociations = computed(() => getElementAssociations(
  dissociableAssociations.value,
  Object.values(EAssociationContextType)
))

const selectedAssociationIds = ref<string[]>([])

const modeContextTypes = computed(() => getAssociableContextTypes(contextType))

const typeOptions = computed(() =>
  modeContextTypes.value.map((type) => {
    const state = mode === Action.ASSOCIATE
      ? getAssociateState(type)
      : getDissociationState(type, dissociableAssociations.value)

    return {
      type,
      label: t(`student.associations.availableContextTypes.${type}`),
      disabled: state.disabled,
      disabledTooltip: state.disabledTooltip
    }
  })
)

const associableOptions = computed<AssociationOption[]>(() =>
  associableAssociations.value.map(association => ({
    label: association.title,
    value: association.id,
    ...association,
  }))
)

const selectedAssociations = computed<Association[]>(() => mode === Action.ASSOCIATE
  ? selectedOptions.value.map(option => ({
      id: option.value.toString(),
      title: option.label,
      ...option,
    }))
  : currentTypeDissociableAssociations.value
      .filter(({ associationId }) => selectedAssociationIds.value.includes(associationId))
      .map(({ associationId, title, contextType }) => ({ id: associationId, title, contextType }))
)

const searchPlaceholder = computed(() => {
  const type = selectedType.value

  if (!type) {
    return ''
  }

  return isFilterable.value
    ? t(`student.associations.contextTypes.${type}.searchFilters.${searchFilter.value}.searchPlaceholder`)
    : t(`student.associations.contextTypes.${type}.searchPlaceholder`)
})

const dissociableAssociationsCount = computed(() => countAssociations(dissociableAssociations.value))

const isLoading = computed(() => isSearchLoading.value || isPending.value || isTaskLoading.value)

const modalKey = 'student.associations.overlays.modals.ManageAssociationModal'

function clear () {
  closeModal()
  selectedOptions.value = []
  searchQuery.value = ''
  searchFilter.value = DEFAULT_ASSOCIATION_SEARCH_FILTER
  selectedAssociationIds.value = []
  selectedType.value = null
}

function onCancel () {
  clear()
  emit('cancel')
}

async function onConfirm () {
  closeModal()

  const promises = Object.values(EAssociationContextType)
    .map(contextType => selectedAssociations.value.filter(association => association.contextType === contextType))
    .filter(associations => associations.length > 0)
    .map((associations) => {
      const commonParams = { contextType, elementId, associatedContextType: associations[0].contextType!, withToasts: false }

      if (mode === Action.ASSOCIATE) {
        return associateAsync({ ...commonParams, idsToAssociate: associations.map(({ id }) => id) })
      }
      else {
        return unassociateAsync({ ...commonParams, associationIds: associations.map(({ id }) => id) })
      }
    })

  const results = await withTaskLoading(() => Promise.allSettled(promises))
  const someRejected = results.some(result => result.status === 'rejected')
  const allRejected = results.every(result => result.status === 'rejected')
  const someFulfilled = results.some(result => result.status === 'fulfilled')
  const allFulfilled = results.every(result => result.status === 'fulfilled')

  if (someRejected) {
    addErrorMessage(t(`${modalKey}.errors.rejected.${allRejected ? 'all' : 'some'}.${mode}`))
  }

  if (someFulfilled) {
    addSuccessMessage(t(`${modalKey}.success.${allFulfilled ? 'all' : 'some'}.${mode}`))

    if (mode === Action.ASSOCIATE) {
      emit('associated')
    }
    else {
      emit('dissociated')
    }
    clear()
  }
}

function onDeleteItem (itemId: string) {
  selectedOptions.value = selectedOptions.value.filter(option => option.value !== itemId)
}

watchEffect(() => {
  if (opened && !selectedType.value) {
    const firstEnabledOption = typeOptions.value.find(option => !option.disabled)
    selectedType.value = firstEnabledOption?.type as EAssociationContextType ?? null
  }
})
</script>

<template>
  <ConfirmationModal
    :opened="opened"
    :is-loading="isLoading"
    :close-button-label="t('global.buttons.cancel')"
    :confirm-button-label="t(`${modalKey}.confirm.label.${mode}`, { count: selectedAssociations.length })"
    :confirm-button-icon="mode === Action.ASSOCIATE ? ICONS.ASSOCIATE : ICONS.DISSOCIATE"
    :confirm-button-disabled="selectedAssociations.length === 0"
    :confirm-button-disabled-tooltip="t(`${modalKey}.confirm.disabledTooltip.${mode}`)"
    :data-testid="`${mode === Action.ASSOCIATE ? 'associate' : 'dissociate'}-${getContextTypeSlug(selectedType as EAssociationContextType, true)}-modal`"
    @close="onCancel"
    @confirm="openModal"
  >
    <template #header>
      <span class="n5">{{ t(`${modalKey}.title.${mode}`) }}</span>
    </template>
    <div class="av-col av-gap-sm">
      <div class="av-col av-pb-sm av-separator-bottom">
        <AssociationContextTypeSelect
          v-model="selectedType"
          :context-types="typeOptions"
          :teleport="true"
          :data-testid="`${mode}-elements-type-select`"
        />
      </div>
      <QuerySuspense
        :is-loading="mode === Action.DISSOCIATE && isAssociationsLoading"
        :error="mode === Action.DISSOCIATE ? associationsError : null"
        :error-title="t(`student.associations.contextTypes.${contextType}.fetchAssociationsError`)"
        :is-empty="mode === Action.DISSOCIATE && !!dissociableAssociations && dissociableAssociationsCount === 0"
        preserve-content
      >
        <template v-if="mode === Action.ASSOCIATE">
          <SearchAssociationLayout
            v-model="selectedOptions"
            v-model:search="searchQuery"
            :options="associableOptions"
            :items="selectedAssociations"
            :input-options="{ placeholder: searchPlaceholder }"
            :get-option-key="option => option.value"
            :get-option-label="option => option.label"
            :loading="isLoading"
            @delete="onDeleteItem"
          >
            <template
              v-if="isFilterable && selectedType"
              #beforeSearch
            >
              <AssociationSearchFilterSelect
                v-model="searchFilter"
                :context-type="(selectedType as EAssociationContextType)"
              />
            </template>

            <template #selectedItem="{ item }">
              <AssociationCompactCard
                v-if="selectedType"
                :context-type="(item.contextType ?? selectedType as EAssociationContextType)"
                :association="item"
                class="av-w-full"
              />
            </template>
          </SearchAssociationLayout>
        </template>

        <template v-else>
          <AssociationsSelector
            v-if="selectedType && dissociableAssociations"
            v-model="selectedAssociationIds"
            :associated-context-type="(selectedType as EAssociationContextType)"
            :associations="dissociableAssociations"
          />
        </template>
      </QuerySuspense>
    </div>
  </ConfirmationModal>

  <ConfirmManageAssociationModal
    :opened="modalOpened"
    :title="t(`${modalKey}.confirmModal.title.${mode}`)"
    :items="selectedAssociations"
    @cancel="closeModal"
    @confirm="onConfirm"
  />
</template>

<style lang="scss" scoped>
:deep(.selected-associate-items-container) {
  max-height: 100%;
  overflow-y: auto;
  padding: var(--spacing-xs) !important;
}
</style>
