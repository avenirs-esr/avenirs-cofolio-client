<script setup lang="ts">
import type { TraceDetailDTO } from '@/api/avenir-esr'
import TermsStep from '@/features/student/views/StudentTraceView/components/UpdateTraceModal/TermsStep.vue'
import UpdateStep from '@/features/student/views/StudentTraceView/components/UpdateTraceModal/UpdateStep.vue'
import { AvButton, AvModal, AvStepper, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const {
  trace,
  show,
  onClose
} = defineProps<{ trace: TraceDetailDTO, show: boolean, onClose: () => void }>()

const { t } = useI18n()

const currentStep = ref(0)
const steps = computed(() => [
  t('student.views.studentTraceView.updateTraceModal.steps.terms.title'),
  t('student.views.studentTraceView.updateTraceModal.steps.update.title')
])

function goToNextStep () {
  currentStep.value++
}

const displayedStep = computed(() => currentStep.value === 0 ? TermsStep : UpdateStep)
const onConfirm = computed(() => currentStep.value === 0 ? goToNextStep : onClose)
const confirmLabel = computed(() => currentStep.value === 0
  ? t('student.views.studentTraceView.updateTraceModal.buttons.validate')
  : t('student.views.studentTraceView.updateTraceModal.buttons.save'))
const confirmIcon = computed(() => currentStep.value === 0
  ? MDI_ICONS.CHECK_CIRCLE
  : MDI_ICONS.CONTENT_SAVE_OUTLINE)
</script>

<template>
  <AvModal
    :opened="show"
    :close-button-label="t('student.views.studentTraceView.updateTraceModal.buttons.close').toUpperCase()"
    close-button-variant="OUTLINED"
    size="lg"
    @close="onClose"
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
        :on-close="onClose"
      />
    </div>

    <template #footer>
      <AvButton
        size="sm"
        variant="OUTLINED"
        :label="confirmLabel"
        :icon="confirmIcon"
        @click="() => onConfirm()"
      />
    </template>
  </AvModal>
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
