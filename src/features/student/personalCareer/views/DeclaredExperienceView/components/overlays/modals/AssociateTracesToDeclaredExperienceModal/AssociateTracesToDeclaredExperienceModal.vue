<script lang="ts" setup>
import type { BaseApiException } from '@/common/exceptions'
import type { AvAutocompleteOption } from '@avenirs-esr/avenirs-dsav'
import {
  invalidateGetDeclaredExperience,
  invalidateGetDeclaredExperienceAssociations,
  useAssociateDeclaredExperienceWithTraces,
  useSearchTracesForAssociationWithDeclaredExperience,
} from '@/api/avenir-esr'
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import { useModal } from '@/common/composables'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { useAssociationModal } from '@/features/student/global'
import SearchAssociationLayout from '@/features/student/global/components/interaction/SearchAssociationLayout/SearchAssociationLayout.vue'
import ConfirmAssociateModal from '@/features/student/global/components/overlays/modals/ConfirmAssociateModal/ConfirmAssociateModal.vue'
import { TraceAssociationTypes, TraceCompactCard, TracesTypeSelect } from '@/features/student/traces'
import { useToasterStore } from '@/store'
import { AvModal } from '@avenirs-esr/avenirs-dsav'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export interface AssociateTracesToDeclaredExperienceModalProps {
  show: boolean
  declaredExperienceId: string
}

const { show, declaredExperienceId } = defineProps<AssociateTracesToDeclaredExperienceModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'associated'): void
}>()

const { t } = useI18n()
const { getErrorMessage } = useApiErrors()
const { addErrorMessage, addSuccessMessage } = useToasterStore()
const queryClient = useQueryClient()
const { isLoading, withTaskLoading } = useTaskLoading()

const selectedTraceType = ref<{ itemId: TraceAssociationTypes }>({
  itemId: TraceAssociationTypes.UNASSOCIATED
})

const {
  showModal: showCancelConfirmationModal,
  displayModal: displayCancelConfirmationModal,
  hideModal: hideCancelConfirmationModal
} = useModal()

const {
  searchQuery,
  selectedOptions: selectedTraceOptions,
  selectedAssociations,
  showConfirmModal,
  displayConfirmModal,
  hideConfirmModal,
  onSearch,
  onDeleteItem: onDeleteTrace,
  listenAndDisplayToastOnSearchError
} = useAssociationModal()

const params = computed(() => ({
  isAssociated: getIsAssociatedParam(),
  keyword: searchQuery.value.trim() || undefined,
  page: 0,
  pageSize: 20,
  type: selectedTraceType.value.itemId
}))

const {
  data,
  isError: isSearchError,
  error: searchError
} = useSearchTracesForAssociationWithDeclaredExperience(computed(() => declaredExperienceId), params, {
  query: { enabled: computed(() => show) }
})

const traces = computed(() => data.value?.data ?? [])

listenAndDisplayToastOnSearchError(isSearchError, searchError)

const traceOptions = computed<AvAutocompleteOption[]>(() =>
  traces.value
    .filter(trace => !trace.disabled)
    .map(trace => ({
      label: trace.title,
      value: trace.id,
      disabled: trace.disabled
    }))
)

const idsToAssociate = computed(() => selectedAssociations.value.map(trace => trace.id.toString()))

const { mutate: mutateAssociateDeclaredExperienceWithTraces, isPending } = useAssociateDeclaredExperienceWithTraces()

function associateExperienceWithTraces () {
  mutateAssociateDeclaredExperienceWithTraces({
    experienceId: declaredExperienceId,
    data: { idsToAssociate: idsToAssociate.value }
  }, {
    onError: (error: BaseApiException) => {
      addErrorMessage({
        title: t('global.error.generic'),
        description: getErrorMessage(error),
      })
    },
    onSuccess: async (_, variables) => {
      await withTaskLoading(() => Promise.all([
        invalidateGetDeclaredExperienceAssociations(queryClient, variables.experienceId),
        invalidateGetDeclaredExperience(queryClient, variables.experienceId)
      ]))

      const count = variables.data.idsToAssociate.length

      hideConfirmModal()

      addSuccessMessage({
        timeout: 2000,
        description: t('student.personalCareer.overlays.AssociateTracesToDeclaredExperienceModal.success', { count }),
      })

      emit('associated')
      selectedTraceOptions.value = []
    }
  })
}

function getIsAssociatedParam () {
  const type = selectedTraceType.value.itemId
  if (type === TraceAssociationTypes.ASSOCIATED) {
    return true
  }
  if (type === TraceAssociationTypes.UNASSOCIATED) {
    return false
  }
}

function onCancel () {
  selectedTraceOptions.value = []
  emit('cancel')
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
    data-testid="associate-traces-to-declared-experience-modal"
    :close-button-label="t('global.buttons.cancel')"
    :confirm-button-label="t('student.personalCareer.overlays.AssociateTracesToDeclaredExperienceModal.confirm', { count: selectedTraceOptions.length })"
    :confirm-button-disabled="selectedTraceOptions.length === 0"
    :is-loading="isPending || isLoading"
    @close="onAssociateModalClose"
    @confirm="displayConfirmModal"
  >
    <template #header>
      <div
        class="av-row av-justify-center"
        data-testid="header"
      >
        <span class="b2-regular av-text-text1">
          {{ t('student.personalCareer.overlays.AssociateTracesToDeclaredExperienceModal.title') }}
        </span>
      </div>
    </template>

    <SearchAssociationLayout
      v-model="selectedTraceOptions"
      :options="traceOptions"
      :items="selectedAssociations"
      :input-options="{
        placeholder: t(`student.traces.interactions.pickers.TracesTypeSelect.options.${selectedTraceType.itemId}.searchPlaceholder`),
      }"
      :get-option-key="option => option.value"
      :get-option-label="option => option.label"
      @update:search="onSearch"
      @delete="onDeleteTrace"
    >
      <template #beforeSearch>
        <TracesTypeSelect
          v-model="selectedTraceType"
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
    :is-loading="isPending || isLoading"
    :title="t('student.personalCareer.overlays.AssociateTracesToDeclaredExperienceModal.confirmTitle')"
    @cancel="hideConfirmModal"
    @confirm="associateExperienceWithTraces"
  />

  <ConfirmationModal
    :show="showCancelConfirmationModal"
    :description="t('student.personalCareer.overlays.AssociateTracesToDeclaredExperienceModal.cancelConfirmation')"
    @close="hideCancelConfirmationModal"
    @confirm="onConfirmCancelAssociateModal"
  />
</template>
