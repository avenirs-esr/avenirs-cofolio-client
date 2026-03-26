<script lang="ts" setup>
import type {
  AssociationsCreationRequest,
} from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions/base-api-exception/base-api.exception'
import { useModal } from '@/common/composables'
import {
  useAssociateActivityWithTracesMutation,
  useSearchTracesForAssociationQuery
} from '@/features/student/buildProject/queries/use-activities.query/use-activities.query'
import { TraceAssociationTypes } from '@/features/student/buildProject/types/trace-association.types'
import TraceCompactCard
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/TraceCompactCard/TraceCompactCard.vue'
import ConfirmAssociateTracesModal
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/modals/ConfirmAssociateTracesModal/ConfirmAssociateTracesModal.vue'
import TracesTypeSelect
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/TracesTypeSelect/TracesTypeSelect.vue'
import SearchAssociationLayout from '@/features/student/global/components/interaction/SearchAssociationLayout/SearchAssociationLayout.vue'
import { useToasterStore } from '@/store'
import { type AvAutocompleteOption, AvModal } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface AssociateTracesModalProps {
  show: boolean
  declaredActivityId: string
}

const { show, declaredActivityId } = defineProps<AssociateTracesModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'associated'): void
}>()

const { t } = useI18n()
const { addErrorMessage, addSuccessMessage } = useToasterStore()
const {
  showModal: showConfirmModal,
  displayModal: displayConfirmModal,
  hideModal: hideConfirmModal
} = useModal()

const { mutate: associateActivityWithTraces, isPending } = useAssociateActivityWithTracesMutation({
  onError: (error: BaseApiException) => {
    addErrorMessage({
      title: t('global.error.generic'),
      description: error.message,
    })
  },
  onSuccess: (_, variables) => {
    const count = variables.associationsCreationRequest.idsToAssociate.length

    hideConfirmModal()

    addSuccessMessage({
      timeout: 2000,
      description: t(
        'student.buildProject.activities.views.ProjectActivityDetailedView.AssociateTracesModal.success',
        { count }
      ),
    })

    emit('associated')
  }
})

const selectedTraceType = ref<{ itemId: TraceAssociationTypes }>({
  itemId: TraceAssociationTypes.UNASSOCIATED
})

const searchQuery = ref('')
const selectedTraceOptions = ref<AvAutocompleteOption[]>([])

const {
  traces,
  isError: isSearchError,
  error: searchError
} = useSearchTracesForAssociationQuery({
  declaredActivityId: computed(() => declaredActivityId),
  params: computed(() => ({
    isAssociated: getIsAssociatedParam(),
    keyword: searchQuery.value.trim() || undefined,
    page: 0,
    pageSize: 20,
    type: selectedTraceType.value.itemId
  }))
})

const traceOptions = computed<AvAutocompleteOption[]>(() => {
  return traces.value
    .filter(trace => !trace.disabled)
    .map(trace => ({
      label: trace.title,
      value: trace.id,
      disabled: trace.disabled
    }))
})

const selectedAssociations = computed(() =>
  selectedTraceOptions.value.map(trace => ({
    id: trace.value.toString(),
    title: trace.label
  }))
)

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
  emit('cancel')
}

function onConfirm () {
  const associationsCreationRequest: AssociationsCreationRequest = {
    idsToAssociate: selectedAssociations.value.map(trace => trace.id.toString()),
  }

  associateActivityWithTraces({
    declaredActivityId,
    associationsCreationRequest
  })
}

function onDeleteTrace (traceId: string) {
  selectedTraceOptions.value = selectedTraceOptions.value.filter(trace => trace.value !== traceId)
}

function onSearch (query: string) {
  searchQuery.value = query
}

watch(isSearchError, (value) => {
  if (!value || !searchError.value) {
    return
  }

  addErrorMessage({
    title: t('global.error.generic'),
    description: searchError.value.message,
  })
})
</script>

<template>
  <AvModal
    :opened="show"
    data-testid="associate-traces-modal"
    :close-button-label="t('global.buttons.cancel')"
    :confirm-button-label="t('global.buttons.confirm')"
    @close="onCancel"
    @confirm="displayConfirmModal"
  >
    <template #header>
      <div
        class="av-row av-justify-center"
        data-testid="header"
      >
        <span class="b2-regular av-text-text1">
          {{ t('student.buildProject.activities.views.ProjectActivityDetailedView.AssociateTracesModal.title') }}
        </span>
      </div>
    </template>

    <SearchAssociationLayout
      v-model="selectedTraceOptions"
      :options="traceOptions"
      :items="selectedAssociations"
      :input-options="{
        placeholder: t(`student.buildProject.activities.views.ProjectActivityDetailedView.TracesTypeSelect.options.${selectedTraceType.itemId}.searchPlaceholder`),
      }"
      :get-option-key="option => option.value"
      :get-option-label="option => option.label"
      @search="onSearch"
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

  <ConfirmAssociateTracesModal
    :show="showConfirmModal"
    :traces="selectedAssociations"
    :disabled="isPending"
    @cancel="hideConfirmModal"
    @confirm="onConfirm"
  />
</template>

<style scoped lang="scss">
:deep(.av-autocomplete-input__suffix) {
  top: 50%;
}
</style>
