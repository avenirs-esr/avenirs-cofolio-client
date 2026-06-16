<script setup lang="ts">
import { type TraceDeclaredActivityDTO, useGetLockedDeclaredActivities } from '@/api/avenir-esr'
import { ConfirmationModal } from '@/common/components'
import UpdatePageTitle from '@/common/components/UpdatePageTitle/UpdatePageTitle.vue'
import { useModal, useNavigation } from '@/common/composables'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { ROUTES } from '@/common/constants'
import { BaseApiException } from '@/common/exceptions'
import { useTraceAssociationsQuery, useTraceDetailedQuery } from '@/features/student/traces/queries/use-traces.query/use-traces.query'
import { useTracesStore } from '@/features/student/traces/stores/traces.store'
import { useUpdateTraceForm } from '@/features/student/traces/views/StudentTraceView/components/UpdateTraceForm/use-update-trace-form/use-update-trace-form'
import ConfirmUpdateTraceModal from '@/features/student/traces/views/StudentUpdateTraceView/components/ConfirmUpdateTraceModal/ConfirmUpdateTraceModal.vue'
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
const route = useRoute()
const tracesStore = useTracesStore()
const { updateTraceFormModified } = toRefs(tracesStore)
const { getErrorMessage } = useApiErrors()
const { addSuccessMessage, addErrorMessage } = useToasterStore()
const { navigateToStudentHome, navigateToStudentTraces } = useNavigation()
const { mutateAsync: getLockedDeclaredActivities, isPending } = useGetLockedDeclaredActivities()

function onTraceUpdated () {
  addSuccessMessage({
    timeout: 2000,
    description: t('student.traces.views.StudentUpdateTraceView.success')
  })
  handleConfirmCloseModal()
}

const { form, hasErrors } = useUpdateTraceForm(trace.value, onTraceUpdated)

const {
  showModal: showCloseConfirmationModal,
  displayModal: displayCloseConfirmationModal,
  hideModal: hideCloseConfirmationModal
} = useModal()
const {
  showModal: showConfirmUpdateModal,
  displayModal: displayConfirmUpdateModal,
  hideModal: hideConfirmUpdateModal
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

const isToolsTraceRoute = computed(() =>
  route.name === ROUTES.STUDENT.TOOLS_UPDATE_TRACE.name)

const breadcrumbLinks = computed(() =>
  isToolsTraceRoute.value
    ? toolsBreadcrumbLinks.value
    : homeBreadcrumbLinks.value
)

function navigateBack () {
  isToolsTraceRoute.value
    ? navigateToStudentTraces()
    : navigateToStudentHome()
}

const lockedDeclaredActivities = ref<TraceDeclaredActivityDTO[]>([])
const hasLockedDeclaredActivities = computed(() => lockedDeclaredActivities.value.length > 0)

async function handleConfirm () {
  try {
    const traceLockedDeclaredActivities = await getLockedDeclaredActivities({ data: [traceId] })
    lockedDeclaredActivities.value = traceLockedDeclaredActivities.length > 0
      ? traceLockedDeclaredActivities[0].lockedDeclaredActivities
      : []
  }
  catch (error) {
    addErrorMessage(error instanceof BaseApiException ? getErrorMessage(error) : t('global.error.generic'))
  }

  if (hasLockedDeclaredActivities.value) {
    displayConfirmUpdateModal()
  }
  else {
    await tracesStore.submitUpdateTraceForm()
  }
}

async function handleConfirmSaveModal () {
  hideConfirmUpdateModal()
  await tracesStore.submitUpdateTraceForm()
}

function handleClose () {
  if (updateTraceFormModified.value) {
    displayCloseConfirmationModal()
  }
  else {
    navigateBack()
  }
}

function handleConfirmCloseModal () {
  hideCloseConfirmationModal()
  navigateBack()
}
</script>

<template>
  <div
    v-if="trace"
    class="av-col av-justify-center"
    data-testid="update-trace-main-container"
  >
    <UpdatePageTitle
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
        :confirm-is-loading="isPending"
        @cancel="handleClose"
        @confirm="handleConfirm"
      />
    </div>
  </div>

  <ConfirmationModal
    :show="showCloseConfirmationModal"
    @close="hideCloseConfirmationModal"
    @confirm="handleConfirmCloseModal"
  />

  <ConfirmUpdateTraceModal
    v-if="hasLockedDeclaredActivities"
    :show="showConfirmUpdateModal"
    :locked-declared-activities="lockedDeclaredActivities"
    @close="hideConfirmUpdateModal"
    @confirm="handleConfirmSaveModal"
  />
</template>
