<script lang="ts" setup>
import type { BaseApiException } from '@/common/exceptions/base-api-exception/base-api.exception'
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
import SelectedAssociateTracesContainer
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/SelectedAssociateTracesContainer/SelectedAssociateTracesContainer.vue'
import { useToasterStore } from '@/store'
import { AvModal } from '@avenirs-esr/avenirs-dsav'
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

// TODO: #1219
const dummyAssociations = ref([
  { id: '1', title: '(Placeholder) Trace 1' },
  { id: '2', title: '(Placeholder) Trace 2' },
  { id: '3', title: '(Placeholder) Trace 3' },
  { id: '4', title: '(Placeholder) Trace 4' },
  { id: '5', title: '(Placeholder) Trace 5' },
  { id: '6', title: '(Placeholder) Trace 6' },
  { id: '7', title: '(Placeholder) Trace 7' }
])

function onCancel () {
  emit('cancel')
}

function onConfirm () {
  const associationsCreationRequest: AssociationsCreationRequest = {
    idsToAssociate: dummyAssociations.value.map(trace => trace.id)
  }

  associateActivityWithTraces({
    declaredActivityId,
    associationsCreationRequest
  })
}

function onDeleteTrace (traceId: string) {
  dummyAssociations.value = dummyAssociations.value.filter(trace => trace.id !== traceId)
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

    <div class="associate-traces-modal__content av-row av-align-stretch av-gap-sm">
      <div class="av-flex-fill av-col av-gap-sm">
        <TracesTypeSelect v-model="selectedTraceType" />
      </div>

      <div class="av-flex-fill av-col av-gap-sm">
        <SelectedAssociateTracesContainer
          :traces="dummyAssociations"
          @delete="onDeleteTrace"
        />
      </div>
    </div>
  </AvModal>

  <ConfirmAssociateTracesModal
    :show="showConfirmModal"
    :traces="dummyAssociations"
    :disabled="isPending"
    @cancel="hideConfirmModal"
    @confirm="onConfirm"
  />
</template>

<style lang="scss" scoped>
.associate-traces-modal__content {
  height: 32rem;
}
</style>
