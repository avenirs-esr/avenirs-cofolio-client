<script setup lang="ts">
import type { TraceDetailDTO } from '@/api/avenir-esr'
import { ConfirmationModal } from '@/common/components'
import { useModal } from '@/common/composables'
import { useTracesStore } from '@/features/student/traces/stores/traces/traces'
import TermsStep from '@/features/student/traces/views/StudentTraceView/components/UpdateTraceModal/TermsStep.vue'
import UpdateStep from '@/features/student/traces/views/StudentTraceView/components/UpdateTraceModal/UpdateStep.vue'
import { AvModal, AvStepper, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { trace } = defineProps<{ trace: TraceDetailDTO }>()

enum UpdateTraceModalSteps {
  Terms = 0,
  Update = 1
}

const { t } = useI18n()
const tracesStore = useTracesStore()
const { showUpdateTraceModal, updateTraceFormModified } = toRefs(tracesStore)

const {
  showModal: showConfirmationModal,
  displayModal: displayConfirmationModal,
  hideModal: hideConfirmationModal
} = useModal()

const currentStep = ref(UpdateTraceModalSteps.Terms)

const steps = computed(() => [
  t('student.views.studentTraceView.updateTraceModal.steps.terms.title'),
  t('student.views.studentTraceView.updateTraceModal.steps.update.title')
])

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
  ? t('student.views.studentTraceView.updateTraceModal.buttons.validate')
  : t('student.views.studentTraceView.updateTraceModal.buttons.save'))

const confirmIcon = computed(() => currentStep.value === UpdateTraceModalSteps.Terms
  ? MDI_ICONS.CHECK_CIRCLE_OUTLINE
  : MDI_ICONS.CONTENT_SAVE_OUTLINE)
</script>

<template>
  <AvModal
    :opened="showUpdateTraceModal"
    :close-button-label="t('student.views.studentTraceView.updateTraceModal.buttons.close')"
    :confirm-button-label="confirmLabel"
    :confirm-button-icon="confirmIcon"
    @close="handleClose"
    @confirm="handleConfirm"
  >
    <template #header>
      <div class="header">
        <h5 class="n5">
          {{ t('student.views.studentTraceView.updateTraceModal.title') }} <span class="s1-regular">{{ trace.title }}</span>
        </h5>
      </div>
    </template>

    <div class="main-container">
      <div class="stepper-container">
        <AvStepper
          :steps="steps"
          :current-step="currentStep"
          width="38.75rem"
        />
      </div>

      <component
        :is="displayedStep"
        :trace="trace"
      />
    </div>
  </AvModal>

  <ConfirmationModal
    :show="showConfirmationModal"
    @close="hideConfirmationModal"
    @confirm="closeModal"
  />
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.main-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.stepper-container {
  display: flex;
  justify-content: center;
}
</style>
