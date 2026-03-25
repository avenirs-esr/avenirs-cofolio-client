<script lang="ts" setup>
import type { BaseApiException } from '@/common/exceptions/base-api-exception/base-api.exception'
import { mockedTraceOverview } from '@/__mocks__/fixtures/student'
import {
  type AssociationsCreationRequest,
  EDeclaredActivityAssociationType
} from '@/api/avenir-esr'
import { useModal } from '@/common/composables'
import { useAssociateActivityWithTracesMutation } from '@/features/student/buildProject/queries/use-activities.query/use-activities.query'
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

const selectedTraceType = ref<{ itemId: EDeclaredActivityAssociationType }>({
  itemId: EDeclaredActivityAssociationType.TRACE
})

const searchQuery = ref('')

// TODO : #1219
const traceOptions = computed<AvAutocompleteOption[]>(() => {
  return mockedTraceOverview.map(trace => ({
    label: trace.title,
    value: trace.traceId
  }))
})

// TODO : remove this in #1219
const filteredTraceOptions = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  if (!query) {
    return traceOptions.value
  }

  return traceOptions.value.filter(trace =>
    trace.label.toLowerCase().includes(query)
  )
})

const selectedTraceOptions = ref<AvAutocompleteOption[]>([])

const selectedAssociations = computed(() =>
  selectedTraceOptions.value.map(trace => ({
    id: trace.value.toString(),
    title: trace.label
  }))
)

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
      :options="filteredTraceOptions"
      :traces="selectedAssociations"
      :input-options="{
        placeholder: t(`student.buildProject.activities.views.ProjectActivityDetailedView.TracesTypeSelect.options.${selectedTraceType.itemId}.searchPlaceholder`),
      }"
      :get-option-key="option => option.value"
      :get-option-label="option => option.label"
      @search="onSearch"
      @delete="onDeleteTrace"
    >
      <template #beforeSearch>
        <TracesTypeSelect v-model="selectedTraceType" />
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
