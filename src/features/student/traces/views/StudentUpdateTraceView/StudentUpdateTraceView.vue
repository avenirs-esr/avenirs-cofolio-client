<script setup lang="ts">
import { ConfirmationModal } from '@/common/components'
import DetailedPageTitle from '@/common/components/DetailedPageTitle/DetailedPageTitle.vue'
import { useModal, useNavigation } from '@/common/composables'
import { ROUTES } from '@/common/constants'
import { useTraceAssociationsQuery, useTraceDetailedQuery } from '@/features/student/traces/queries/use-traces.query/use-traces.query'
import { useTracesStore } from '@/features/student/traces/stores/traces.store'
import { useUpdateTraceForm } from '@/features/student/traces/views/StudentTraceView/components/UpdateTraceForm/use-update-trace-form/use-update-trace-form'
import UpdateTabs from '@/features/student/traces/views/StudentUpdateTraceView/components/UpdateTabs/UpdateTabs.vue'
import { useToasterStore } from '@/store'
import { AvCancelConfirmButtons, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface StudentUpdateTraceViewProps {
  traceId: string
}

const { traceId } = defineProps<StudentUpdateTraceViewProps>()

const { traceDetailed: trace } = useTraceDetailedQuery(toRef(() => traceId))
const { traceAssociations: associations } = useTraceAssociationsQuery(toRef(() => traceId))

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

const { navigateToStudentHome, navigateToStudentTraces } = useNavigation()

async function handleConfirm () {
  await tracesStore.submitUpdateTraceForm()
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
  if (updateTraceFormModified.value) {
    displayConfirmationModal()
  }
  else {
    navigateBack()
  }
}
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

    <UpdateTabs
      :trace="trace"
      :associations="associations"
      :form="form"
    />

    <div class="av-row av-justify-end av-mt-lg">
      <AvCancelConfirmButtons
        :cancel-label="t('global.buttons.close')"
        :confirm-label="t('global.buttons.save')"
        :cancel-icon="MDI_ICONS.CLOSE_CIRCLE_OUTLINE"
        :confirm-icon="MDI_ICONS.CONTENT_SAVE_OUTLINE"
        :confirm-disabled="hasErrors"
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
