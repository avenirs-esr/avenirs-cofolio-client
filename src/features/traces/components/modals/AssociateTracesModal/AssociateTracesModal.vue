<script lang="ts" setup>
import type { AssociationSearchResultTraceDTO } from '@/api/avenir-esr'
import type { TraceAssociationTypes } from '@/features/traces/types/trace-association.types'
import type { AvAutocompleteOption } from '@avenirs-esr/avenirs-dsav'
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import { useModal } from '@/common/composables'
import { ICONS } from '@/common/constants'
import { useAssociationModal } from '@/features/global'
import SearchAssociationLayout from '@/features/global/components/interaction/SearchAssociationLayout/SearchAssociationLayout.vue'
import ConfirmAssociateModal from '@/features/global/components/overlays/modals/ConfirmAssociateModal/ConfirmAssociateModal.vue'
import TraceCompactCard from '@/features/traces/components/cards/TraceCompactCard/TraceCompactCard.vue'
import TracesTypeSelect from '@/features/traces/components/interactions/pickers/TracesTypeSelect/TracesTypeSelect.vue'
import { AvModal } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface AssociateTracesModalProps {
  show: boolean
  traces: AssociationSearchResultTraceDTO[]
  selectedTraceType: { itemId: TraceAssociationTypes }
  isLoading?: boolean
}

const { show, traces, selectedTraceType, isLoading = false } = defineProps<AssociateTracesModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'search', query: string): void
  (e: 'associate', ids: string[]): void
  (e: 'update:selectedTraceType', value: { itemId: TraceAssociationTypes }): void
}>()

const { t } = useI18n()

const {
  showModal: showCancelConfirmationModal,
  displayModal: displayCancelConfirmationModal,
  hideModal: hideCancelConfirmationModal
} = useModal()

const {
  selectedOptions: selectedTraceOptions,
  selectedAssociations,
  showConfirmModal,
  displayConfirmModal,
  hideConfirmModal,
  onDeleteItem: onDeleteTrace,
} = useAssociationModal()

const localSelectedTraceType = computed({
  get: () => selectedTraceType,
  set: value => emit('update:selectedTraceType', value)
})

const traceOptions = computed<AvAutocompleteOption[]>(() =>
  traces
    .map(trace => ({
      label: trace.title,
      value: trace.id,
      disabled: trace.disabled
    }))
)

watch(() => show, (newVal) => {
  if (!newVal) {
    hideConfirmModal()
    selectedTraceOptions.value = []
  }
})

function onSearch (query: string) {
  emit('search', query)
}

function onCancel () {
  selectedTraceOptions.value = []
  emit('cancel')
}

function onConfirm () {
  emit('associate', selectedAssociations.value.map(trace => trace.id))
}

function onAssociateModalClose () {
  if (selectedTraceOptions.value.length > 0) {
    displayCancelConfirmationModal()
    return
  }

  onCancel()
}

function onConfirmCancelAssociateModal () {
  hideCancelConfirmationModal()
  onCancel()
}
</script>

<template>
  <AvModal
    :opened="show"
    data-testid="associate-traces-modal"
    :close-button-label="t('global.buttons.cancel')"
    :confirm-button-label="t('student.traces.modals.AssociateTracesModal.confirm', { count: selectedTraceOptions.length })"
    :confirm-button-disabled="selectedTraceOptions.length === 0"
    :confirm-button-icon="ICONS.ASSOCIATIONS"
    :is-loading="isLoading"
    @close="onAssociateModalClose"
    @confirm="displayConfirmModal"
  >
    <template #header>
      <div
        class="av-row av-justify-center"
        data-testid="header"
      >
        <span class="b2-regular av-text-text1">
          {{ t('student.traces.modals.AssociateTracesModal.title') }}
        </span>
      </div>
    </template>

    <SearchAssociationLayout
      v-model="selectedTraceOptions"
      :options="traceOptions"
      :items="selectedAssociations"
      :input-options="{
        placeholder: t(`student.traces.interactions.pickers.TracesTypeSelect.options.${localSelectedTraceType.itemId}.searchPlaceholder`),
      }"
      :get-option-key="option => option.value"
      :get-option-label="option => option.label"
      :loading="isLoading"
      @update:search="onSearch"
      @delete="onDeleteTrace"
    >
      <template #beforeSearch>
        <TracesTypeSelect
          v-model="localSelectedTraceType"
          data-testid="traces-type-select"
        />
      </template>

      <template #selectedItem="{ item }">
        <TraceCompactCard
          :trace="item"
          class="av-w-full"
        />
      </template>
    </SearchAssociationLayout>
  </AvModal>

  <ConfirmAssociateModal
    :show="showConfirmModal"
    :items="selectedAssociations"
    :is-loading="isLoading"
    :title="t('student.traces.modals.AssociateTracesModal.confirmTitle', { count: selectedAssociations.length })"
    @cancel="hideConfirmModal"
    @confirm="onConfirm"
  />

  <ConfirmationModal
    :show="showCancelConfirmationModal"
    :description="t('student.traces.modals.AssociateTracesModal.cancelConfirmation')"
    @close="hideCancelConfirmationModal"
    @confirm="onConfirmCancelAssociateModal"
  />
</template>
