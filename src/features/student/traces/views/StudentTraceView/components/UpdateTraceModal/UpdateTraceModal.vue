<script setup lang="ts">
import type { TraceAssociationsDTO, TraceDetailDTO } from '@/api/avenir-esr'
import { ConfirmationModal } from '@/common/components'
import { useModal } from '@/common/composables'
import { useTracesStore } from '@/features/student/traces/stores/traces.store'
import { useUpdateTraceForm } from '@/features/student/traces/views/StudentTraceView/components/UpdateTraceForm/use-update-trace-form/use-update-trace-form'
import TermsStep from '@/features/student/traces/views/StudentTraceView/components/UpdateTraceModal/TermsStep.vue'
import UpdateStep from '@/features/student/traces/views/StudentTraceView/components/UpdateTraceModal/UpdateStep.vue'
import { useToasterStore } from '@/store'
import { AvModal, AvStepper, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface UpdateTraceModalProps {
  trace: TraceDetailDTO
  associations: TraceAssociationsDTO
}

const { trace, associations } = defineProps<UpdateTraceModalProps>()

enum UpdateTraceModalSteps {
  Terms = 0,
  Update = 1
}

const { t } = useI18n()
const tracesStore = useTracesStore()
const { showUpdateTraceModal, updateTraceFormModified } = toRefs(tracesStore)
const { addSuccessMessage } = useToasterStore()

function onTraceUpdated () {
  addSuccessMessage({
    timeout: 2000,
    description: t('student.traces.views.StudentTraceView.updateTraceModal.success')
  })
  closeModal()
}

const { form, hasErrors } = useUpdateTraceForm(trace, onTraceUpdated)

const {
  showModal: showConfirmationModal,
  displayModal: displayConfirmationModal,
  hideModal: hideConfirmationModal
} = useModal()

const currentStep = ref(UpdateTraceModalSteps.Terms)

const steps = computed(() => [
  t('student.traces.views.StudentTraceView.updateTraceModal.steps.terms.title'),
  t('student.traces.views.StudentTraceView.updateTraceModal.steps.update.title')
])

const confirmDisabled = computed(() => currentStep.value === UpdateTraceModalSteps.Update && hasErrors.value)

function goToNextStep () {
  currentStep.value++
}

async function handleConfirm () {
  if (currentStep.value === UpdateTraceModalSteps.Terms) {
    goToNextStep()
  }
  else {
    await tracesStore.submitUpdateTraceForm()
  }
}

function handleClose () {
  if (currentStep.value === UpdateTraceModalSteps.Update && updateTraceFormModified.value) {
    displayConfirmationModal()
  }
  else {
    closeModal()
  }
}

function closeModal () {
  tracesStore.hideUpdateTraceModal()
  hideConfirmationModal()
  currentStep.value = UpdateTraceModalSteps.Terms
}

const displayedStep = computed(() => currentStep.value === UpdateTraceModalSteps.Terms
  ? TermsStep
  : UpdateStep)

const confirmLabel = computed(() => currentStep.value === UpdateTraceModalSteps.Terms
  ? t('student.traces.views.StudentTraceView.updateTraceModal.buttons.validate')
  : t('student.traces.views.StudentTraceView.updateTraceModal.buttons.save'))

const confirmIcon = computed(() => currentStep.value === UpdateTraceModalSteps.Terms
  ? MDI_ICONS.CHECK_CIRCLE_OUTLINE
  : MDI_ICONS.CONTENT_SAVE_OUTLINE)
</script>

<template>
  <AvModal
    :opened="showUpdateTraceModal"
    :close-button-label="t('student.traces.views.StudentTraceView.updateTraceModal.buttons.close')"
    :confirm-button-label="confirmLabel"
    :confirm-button-icon="confirmIcon"
    :confirm-button-disabled="confirmDisabled"
    @close="handleClose"
    @confirm="handleConfirm"
  >
    <template #header>
      <h5 class="n5">
        {{ t('student.traces.views.StudentTraceView.updateTraceModal.title') }} <span class="s1-regular">{{ trace.title }}</span>
      </h5>
    </template>

    <div class="av-col av-justify-center">
      <div class="av-row av-justify-center">
        <AvStepper
          :steps="steps"
          :current-step="currentStep"
          width="38.75rem"
        />
      </div>

      <component
        :is="displayedStep"
        :trace="trace"
        :associations="associations"
        :form="form"
      />
    </div>
  </AvModal>

  <ConfirmationModal
    :show="showConfirmationModal"
    @close="hideConfirmationModal"
    @confirm="closeModal"
  />
</template>
