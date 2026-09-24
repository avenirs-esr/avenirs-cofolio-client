<script lang="ts" setup>
import type { Association } from '@/features/student/associations/types/associations.types'
import type { AvAutocompleteOption } from '@avenirs-esr/avenirs-dsav'
import { EAssociationContextType } from '@/api/avenir-esr'
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import { useModal } from '@/common/composables'
import { ICONS } from '@/common/constants'
import AssociationCompactCard from '@/features/student/associations/components/cards/AssociationCompactCard/AssociationCompactCard.vue'
import AssociationSearchFilterSelect
  from '@/features/student/associations/components/interactions/AssociationSearchFilterSelect/AssociationSearchFilterSelect.vue'
import SearchAssociationLayout from '@/features/student/associations/components/interactions/SearchAssociationLayout/SearchAssociationLayout.vue'
import ConfirmAssociateModal from '@/features/student/associations/components/overlays/modals/ConfirmAssociateModal/ConfirmAssociateModal.vue'
import { useAssociationMutations } from '@/features/student/associations/composables/use-association-mutations/use-association-mutations'
import { useAssociationSearch } from '@/features/student/associations/composables/use-association-search/use-association-search'
import { DEFAULT_ASSOCIATION_SEARCH_FILTER } from '@/features/student/associations/constants/associations.constants'
import { getContextTypeSlug } from '@/features/student/associations/utils/associations.utils'
import { AvModal } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

type AssociationOption = AvAutocompleteOption & Pick<Association, 'category'>

export interface AssociateModalProps {
  opened: boolean
  /** Context type of the element to associate. */
  contextType: EAssociationContextType
  /** Id of the element to associate. */
  elementId: string
  /** Context type of the elements to associate with the element. */
  associatedContextType: EAssociationContextType
}

const { opened, contextType, elementId, associatedContextType } = defineProps<AssociateModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'associated'): void
}>()

const isDark = computed(() => associatedContextType === EAssociationContextType.DECLARED_SKILL)

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

const {
  searchQuery,
  searchFilter,
  isFilterable,
  associations,
  isLoading: isSearchLoading
} = useAssociationSearch({
  contextType,
  elementId: () => elementId,
  associatedContextType: () => associatedContextType,
  enabled: () => opened
})

const { associate, isPending } = useAssociationMutations()

const selectedOptions = ref<AssociationOption[]>([])

const options = computed<AssociationOption[]>(() =>
  associations.value.map(association => ({
    label: association.title,
    value: association.id,
    description: association.description,
    category: association.category,
    disabled: association.disabled
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

const searchPlaceholder = computed(() => isFilterable.value
  ? t(`student.associations.contextTypes.${associatedContextType}.searchFilters.${searchFilter.value}.searchPlaceholder`)
  : t(`student.associations.contextTypes.${associatedContextType}.searchPlaceholder`))

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
    associatedContextType,
    idsToAssociate: selectedAssociations.value.map(({ id }) => id)
  }, () => {
    clear()
    emit('associated')
  })
}
</script>

<template>
  <AvModal
    :opened="opened"
    :data-testid="`associate-${getContextTypeSlug(associatedContextType, true)}-modal`"
    :close-button-label="t('global.buttons.cancel')"
    :confirm-button-label="t(`student.associations.contextTypes.${associatedContextType}.associateConfirm`, { count: selectedAssociations.length })"
    :confirm-button-icon="ICONS.ASSOCIATIONS"
    :confirm-button-disabled="selectedAssociations.length === 0"
    :confirm-button-disabled-tooltip="t(`student.associations.contextTypes.${associatedContextType}.confirmButtonDisabledTooltip`)"
    :is-loading="isLoading"
    @close="onClose"
    @confirm="openConfirmModal"
  >
    <template #header>
      <div
        class="av-row av-justify-center"
        data-testid="header"
      >
        <span class="b2-regular av-text-text1">
          {{ t(`student.associations.contextTypes.${associatedContextType}.associateTitle`) }}
        </span>
      </div>
    </template>

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
          :context-type="associatedContextType"
        />
      </template>

      <template #selectedItem="{ item }">
        <AssociationCompactCard
          :context-type="associatedContextType"
          :association="item"
          class="av-w-full"
        />
      </template>
    </SearchAssociationLayout>
  </AvModal>

  <ConfirmAssociateModal
    :opened="confirmModalOpened"
    :title="t(`student.associations.contextTypes.${associatedContextType}.associateConfirmTitle`, { count: selectedAssociations.length })"
    :items="selectedAssociations"
    @cancel="closeConfirmModal"
    @confirm="onConfirm"
  />

  <ConfirmationModal
    :opened="cancelConfirmationModalOpened"
    :description="t(`student.associations.contextTypes.${associatedContextType}.cancelConfirmation`)"
    @close="closeCancelConfirmationModal"
    @confirm="onCancel"
  />
</template>
