<script lang="ts" setup>
import type { AvAutocompleteOption, AvSelectSelectedOption } from '@avenirs-esr/avenirs-dsav'
import type { Association } from '@/features/student/associations/types/associations.types'
import { AvSelect } from '@avenirs-esr/avenirs-dsav'
import { ConfirmationModal, ICONS, useModal } from '@avenirs-esr/shared'
import { EAssociationContextType } from '@avenirs-esr/shared/api/avenir-esr'
import { useI18n } from 'vue-i18n'
import AssociationCompactCard from '@/features/student/associations/components/cards/AssociationCompactCard/AssociationCompactCard.vue'
import AssociationSearchFilterSelect from '@/features/student/associations/components/interactions/AssociationSearchFilterSelect/AssociationSearchFilterSelect.vue'
import SearchAssociationLayout from '@/features/student/associations/components/interactions/SearchAssociationLayout/SearchAssociationLayout.vue'
import ConfirmAssociateModal from '@/features/student/associations/components/overlays/modals/ConfirmAssociateModal/ConfirmAssociateModal.vue'
import { useAssociationMutations } from '@/features/student/associations/composables/use-association-mutations/use-association-mutations'
import { useAssociationSearch } from '@/features/student/associations/composables/use-association-search/use-association-search'
import { useAssociationType } from '@/features/student/associations/composables/use-association-type/use-association-type'
import { DEFAULT_ASSOCIATION_SEARCH_FILTER } from '@/features/student/associations/constants/associations.constants'
import { getContextTypeSlug } from '@/features/student/associations/utils/associations.utils'

type AssociationOption = AvAutocompleteOption & Pick<Association, 'category'>

export interface AssociateModalProps {
  opened: boolean
  /** Context type of the element to associate. */
  contextType: EAssociationContextType
  /** Id of the element to associate. */
  elementId: string
}

const { opened, contextType, elementId } = defineProps<AssociateModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'associated'): void
}>()

const { selectableTypes, selectedType, selectedOption, typeOptions, } = useAssociationType ({
  contextType,
  elementId,
  action: 'associate',
})

const isDark = computed(() => selectedType.value === EAssociationContextType.DECLARED_SKILL)

const { t } = useI18n()

const {
  modalOpened: confirmModalOpened,
  openModal: openConfirmModal,
  closeModal: closeConfirmModal
} = useModal()
const {
  modalOpened: cancelConfirmationModalOpened,
  openModal: openCancelConfirmationModal,
  closeModal: closeCancelConfirmationModal
} = useModal()

const selectedOptions = ref<AssociationOption[]>([])

const {
  searchQuery,
  searchFilter,
  isFilterable,
  associations,
  isLoading: isSearchLoading
} = useAssociationSearch({
  contextType,
  elementId: () => elementId,
  associatedContextType: () => selectedType.value!,
  selectedIds: () => selectedOptions.value.map(({ value }) => value.toString()),
  enabled: () => opened && !!selectedType?.value
})

const { associate, isPending } = useAssociationMutations()

const options = computed<AssociationOption[]>(() =>
  associations.value.map(association => ({
    label: association.title,
    value: association.id,
    description: association.description,
    category: association.category,
    disabled: association.disabled,
    disabledTooltip: association.disabledTooltip
  }))
)
const selectedAssociations = computed<Association[]>(() =>
  selectedOptions.value.map(option => ({
    id: option.value.toString(),
    title: option.label,
    description: option.description,
    category: option.category
  }))
)

const searchPlaceholder = computed(() => {
  const type = selectedType!.value
  if (type == null) {
    return ''
  }
  return isFilterable.value
    ? t(`student.associations.contextTypes.${type}.searchFilters.${searchFilter.value}.searchPlaceholder`)
    : t(`student.associations.contextTypes.${type}.searchPlaceholder`)
})

const isLoading = computed(() => isSearchLoading.value || isPending.value)

function clear () {
  closeConfirmModal()
  closeCancelConfirmationModal()
  selectedOptions.value = []
  searchQuery.value = ''
  searchFilter.value = DEFAULT_ASSOCIATION_SEARCH_FILTER
}

function onDeleteItem (itemId: string) {
  selectedOptions.value = selectedOptions.value.filter(option => option.value !== itemId)
}

function onCancel () {
  clear()
  emit('cancel')
}

function onClose () {
  if (selectedOptions.value.length > 0) {
    openCancelConfirmationModal()
    return
  }

  onCancel()
}

function onConfirm () {
  closeConfirmModal()

  associate({
    contextType,
    elementId,
    associatedContextType: selectedType.value!,
    idsToAssociate: selectedAssociations.value.map(({ id }) => id)
  }, () => {
    clear()
    emit('associated')
  })
}
</script>

<template>
  <ConfirmationModal
    :opened="opened"
    :data-testid="selectedType ? `associate-${getContextTypeSlug(selectedType!, true)}-modal` : undefined"
    :close-button-label="t('global.buttons.cancel')"
    :confirm-button-label="selectedType ? t(`student.associations.contextTypes.${selectedType}.associateConfirm`, { count: selectedAssociations.length }) : t('global.buttons.associate')"
    :confirm-button-icon="ICONS.ASSOCIATE"
    :confirm-button-disabled="!selectedType || selectedAssociations.length === 0"
    :confirm-button-disabled-tooltip="selectedType ? t(`student.associations.contextTypes.${selectedType}.confirmButtonDisabledTooltip`) : undefined"
    :is-loading="isLoading"
    @close="onClose"
    @confirm="openConfirmModal"
  >
    <template
      v-if="selectedType"
      #header
    >
      <div
        class="av-row av-justify-center"
        data-testid="header"
      >
        <span class="b2-regular av-text-text1">
          {{ t(`student.associations.contextTypes.${selectedType}.associateTitle`) }}
        </span>
      </div>
    </template>

    <AvSelect
      v-if="selectableTypes.length"
      :model-value="selectedOption"
      :options="typeOptions"
      :label="t('student.associations.overlays.associateModal.chooseType')"
      :placeholder="t(`student.associations.overlays.associateModal.noElementsToAssociate`)"
      disabled-tooltip="student.associations.overlays.associateModal.noElementsToAssociate"
      data-testid="association-type-select"
      @update:model-value="(option) => { selectedOption = option as AvSelectSelectedOption | null }"
    />
    <template v-if="selectedType">
      <SearchAssociationLayout
        v-model="selectedOptions"
        v-model:search="searchQuery"
        :options="options"
        :items="selectedAssociations"
        :input-options="{ placeholder: searchPlaceholder }"
        :get-option-key="option => option.value"
        :get-option-label="option => option.label"
        :loading="isLoading"
        :button-theme="isDark ? 'TERTIARY' : 'PRIMARY'"
        @delete="onDeleteItem"
      >
        <template
          v-if="isFilterable"
          #beforeSearch
        >
          <AssociationSearchFilterSelect
            v-model="searchFilter"
            :context-type="selectedType"
          />
        </template>

        <template #selectedItem="{ item }">
          <AssociationCompactCard
            v-if="selectedType"
            :context-type="selectedType"
            :association="item"
            class="av-w-full"
          />
        </template>
      </SearchAssociationLayout>
    </template>
  </ConfirmationModal>

  <ConfirmAssociateModal
    :opened="confirmModalOpened"
    :title="selectedType ? t(`student.associations.contextTypes.${selectedType}.associateConfirmTitle`, { count: selectedAssociations.length }) : ''"
    :items="selectedAssociations"
    @cancel="closeConfirmModal"
    @confirm="onConfirm"
  />

  <ConfirmationModal
    :opened="cancelConfirmationModalOpened"
    :description="selectedType ? t(`student.associations.contextTypes.${selectedType}.cancelConfirmation`) : undefined"
    :data-testid="selectedType ? `associate-${getContextTypeSlug(selectedType!, true)}-confirmation-modal` : undefined"
    @close="closeCancelConfirmationModal"
    @confirm="onCancel"
  />
</template>
