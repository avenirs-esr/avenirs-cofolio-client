<script setup lang="ts">
import { ConfirmationModal } from '@/common/components'
import DetailedPageTitle from '@/common/components/DetailedPageTitle/DetailedPageTitle.vue'
import { useModal, useNavigation } from '@/common/composables'
import { ROUTES } from '@/common/constants'
import { useTraceAssociationsQuery, useTraceDetailedQuery } from '@/features/student/traces/queries/use-traces.query/use-traces.query'
import { useTracesStore } from '@/features/student/traces/stores/traces.store'
import { useUpdateTraceForm } from '@/features/student/traces/views/StudentTraceView/components/UpdateTraceForm/use-update-trace-form/use-update-trace-form'
import TermsStep from '@/features/student/traces/views/StudentTraceView/components/UpdateTraceModal/TermsStep.vue'
import UpdateStep from '@/features/student/traces/views/StudentTraceView/components/UpdateTraceModal/UpdateStep.vue'
import { useToasterStore } from '@/store'
import { AvCancelConfirmButtons, AvStepper, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface StudentUpdateTraceViewProps {
  traceId: string
}

const { traceId } = defineProps<StudentUpdateTraceViewProps>()

const { traceDetailed: trace } = useTraceDetailedQuery(toRef(() => traceId))
const { traceAssociations: associations } = useTraceAssociationsQuery(toRef(() => traceId))

enum UpdateTraceModalSteps {
  Terms = 0,
  Update = 1
}

const { t } = useI18n()
const tracesStore = useTracesStore()
const { updateTraceFormModified } = toRefs(tracesStore)
const { addSuccessMessage } = useToasterStore()

function onTraceUpdated () {
  addSuccessMessage({
    timeout: 2000,
    description: t('student.traces.views.StudentUpdateTraceView.success')
  })
  closeModal()
}

const { form, hasErrors } = useUpdateTraceForm(trace.value!, onTraceUpdated)

const {
  showModal: showConfirmationModal,
  displayModal: displayConfirmationModal,
  hideModal: hideConfirmationModal
} = useModal()

const currentStep = ref(UpdateTraceModalSteps.Terms)

const confirmDisabled = computed(() =>
  currentStep.value === UpdateTraceModalSteps.Update
  && hasErrors.value
)

const toolsBreadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.tools.header') },
  { text: t('student.global.navigation.tabs.tools.items.traces'), to: ROUTES.STUDENT.TOOLS_TRACES },
  {
    text: trace.value?.title || '',
    to: {
      name: ROUTES.STUDENT.TOOLS_TRACE.name,
      params: { id: traceId },
    },
  },
  { text: t('global.buttons.update'), },
])

const homeBreadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  {
    text: trace.value?.title || '',
    to: {
      name: ROUTES.STUDENT.TRACE.name,
      params: { id: traceId },
    },
  },
  { text: t('global.buttons.update'), },
])

const route = useRoute()

const isToolsTraceRoute = computed(() =>
  route.name === ROUTES.STUDENT.TOOLS_UPDATE_TRACE.name)

const breadcrumbLinks = computed(() =>
  isToolsTraceRoute.value
    ? toolsBreadcrumbLinks.value
    : homeBreadcrumbLinks.value
)

const steps = computed(() => [
  t('student.traces.views.StudentUpdateTraceView.steps.terms.title'),
  t('student.traces.views.StudentUpdateTraceView.steps.update.title')
])

const confirmLabel = computed(() =>
  currentStep.value === UpdateTraceModalSteps.Terms
    ? t('student.traces.views.StudentUpdateTraceView.buttons.validate')
    : t('global.buttons.save')
)

const confirmIcon = computed(() =>
  currentStep.value === UpdateTraceModalSteps.Terms
    ? MDI_ICONS.CHECK_CIRCLE_OUTLINE
    : MDI_ICONS.CONTENT_SAVE_OUTLINE
)

const { navigateToStudentHome, navigateToStudentTraces } = useNavigation()

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

function navigateBack () {
  isToolsTraceRoute.value
    ? navigateToStudentTraces()
    : navigateToStudentHome()
}

function closeModal () {
  hideConfirmationModal()
  navigateBack()
}

function handleClose () {
  if (
    currentStep.value === UpdateTraceModalSteps.Update
    && updateTraceFormModified.value
  ) {
    displayConfirmationModal()
  }
  else {
    navigateBack()
  }
}

const displayedStep = computed(() =>
  currentStep.value === UpdateTraceModalSteps.Terms
    ? TermsStep
    : UpdateStep
)
</script>

<template>
  <div
    v-if="trace"
    class="av-col av-justify-center"
  >
    <DetailedPageTitle
      :title="trace.title ?? ''"
      :breadcrumb-links="breadcrumbLinks"
    />

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

    <div class="av-row av-justify-end av-mt-lg">
      <AvCancelConfirmButtons
        :cancel-label="t('global.buttons.close')"
        :confirm-label="confirmLabel"
        :cancel-icon="MDI_ICONS.CLOSE_CIRCLE_OUTLINE"
        :confirm-icon="confirmIcon"
        :confirm-disabled="confirmDisabled"
        @cancel="handleClose"
        @confirm="handleConfirm"
      />
    </div>
  </div>

  <ConfirmationModal
    :show="showConfirmationModal"
    @close="hideConfirmationModal"
    @confirm="closeModal"
  />
</template>
