<script setup lang="ts">
import type { TraceDetailDTO } from '@/api/avenir-esr'
import TermsStep from '@/features/student/views/StudentTraceView/components/UpdateTraceModal/TermsStep.vue'
import UpdateStep from '@/features/student/views/StudentTraceView/components/UpdateTraceModal/UpdateStep.vue'
import { useTracesStore } from '@/store'
import { AvModal, AvStepper, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { trace } = defineProps<{ trace: TraceDetailDTO }>()

const { t } = useI18n()
const tracesStore = useTracesStore()
const { showUpdateTraceModal, hideUpdateTraceModal } = toRefs(tracesStore)

const currentStep = ref(0)

const steps = computed(() => [
  t('student.views.studentTraceView.updateTraceModal.steps.terms.title'),
  t('student.views.studentTraceView.updateTraceModal.steps.update.title')
])

function goToNextStep () {
  currentStep.value++
}

async function handleConfirm () {
  if (currentStep.value === 0) {
    goToNextStep()
  }
  else {
    await tracesStore.submitUpdateTraceForm()
  }
}

const displayedStep = computed(() => currentStep.value === 0 ? TermsStep : UpdateStep)
const confirmLabel = computed(() => currentStep.value === 0
  ? t('student.views.studentTraceView.updateTraceModal.buttons.validate')
  : t('student.views.studentTraceView.updateTraceModal.buttons.save'))

const confirmIcon = computed(() => currentStep.value === 0
  ? MDI_ICONS.CHECK_CIRCLE_OUTLINE
  : MDI_ICONS.CONTENT_SAVE_OUTLINE)
</script>

<template>
  <AvModal
    :opened="showUpdateTraceModal"
    :close-button-label="t('student.views.studentTraceView.updateTraceModal.buttons.close').toUpperCase()"
    :confirm-button-label="confirmLabel"
    :confirm-button-icon="confirmIcon"
    size="lg"
    @close="hideUpdateTraceModal"
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
