<script setup lang="ts">
import { EAssociationContextType, type TraceDeclaredActivityDTO, useGetAssociations, useGetLockedDeclaredActivities, useGetTraceDetail } from '@/api/avenir-esr'
import { ConfirmationModal } from '@/common/components'
import UpdateInProgressBadge from '@/common/components/badges/UpdateInProgressBadge/UpdateInProgressBadge.vue'
import UpdatePageTitle from '@/common/components/UpdatePageTitle/UpdatePageTitle.vue'
import { useModal, useNavigation } from '@/common/composables'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { ROUTES } from '@/common/constants'
import { BaseApiException } from '@/common/exceptions'
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

const { data: trace } = useGetTraceDetail(toRef(() => traceId))
const { data: associations } = useGetAssociations(EAssociationContextType.TRACE, toRef(() => traceId))
const { data: traceLockedDeclaredActivities, isFetching } = useGetLockedDeclaredActivities([traceId])

const { t } = useI18n()
const route = useRoute()
const tracesStore = useTracesStore()
const { updateTraceFormModified } = toRefs(tracesStore)
const { getErrorMessage } = useApiErrors()
const { addSuccessMessage, addErrorMessage } = useToasterStore()
const { navigateToStudentTrace, navigateToStudentToolsTrace } = useNavigation()

function onTraceUpdated () {
  addSuccessMessage({
    timeout: 2000,
    description: t('student.traces.views.StudentUpdateTraceView.success')
  })
  handleConfirmCloseModal()
}

const { form, hasErrors, isOnlyValorizedModified } = useUpdateTraceForm(trace.value, onTraceUpdated)

const {
  modalOpened: closeConfirmationModalOpened,
  openModal: openCloseConfirmationModal,
  closeModal: closeCloseConfirmationModal
} = useModal()
const {
  modalOpened: confirmUpdateModalOpened,
  openModal: openConfirmUpdateModal,
  closeModal: closeConfirmUpdateModal
} = useModal()

const isToolsTraceRoute = computed(() =>
  route.name === ROUTES.STUDENT.TOOLS_UPDATE_TRACE.name)

const trailingLinks = computed(() => [
  {
    text: trace.value?.title || '',
    to: {
      name: isToolsTraceRoute.value ? ROUTES.STUDENT.TOOLS_TRACE.name : ROUTES.STUDENT.TRACE.name,
      params: { id: traceId },
    },
  },
  { text: t('global.buttons.update') }
])

function navigateBack () {
  isToolsTraceRoute.value
    ? navigateToStudentToolsTrace({ id: traceId })
    : navigateToStudentTrace({ id: traceId })
}

const lockedDeclaredActivities = ref<TraceDeclaredActivityDTO[]>([])

async function handleConfirm () {
  if (isOnlyValorizedModified.value) {
    await tracesStore.submitUpdateTraceForm()
    return
  }

  try {
    lockedDeclaredActivities.value = !!traceLockedDeclaredActivities.value && traceLockedDeclaredActivities.value.length > 0
      ? traceLockedDeclaredActivities.value[0].lockedDeclaredActivities
      : []
  }
  catch (error) {
    addErrorMessage(error instanceof BaseApiException ? getErrorMessage(error) : t('global.error.generic'))
  }

  openConfirmUpdateModal()
}

async function handleConfirmSaveModal () {
  closeConfirmUpdateModal()
  await tracesStore.submitUpdateTraceForm()
}

function handleClose () {
  if (updateTraceFormModified.value) {
    openCloseConfirmationModal()
  }
  else {
    navigateBack()
  }
}

function handleConfirmCloseModal () {
  closeCloseConfirmationModal()
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
      :trailing-links="trailingLinks"
    >
      <template #actions>
        <UpdateInProgressBadge show />
      </template>
    </UpdatePageTitle>

    <div class="av-col av-gap-sm">
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
          :confirm-disabled-tooltip="t('global.information.invalidForm')"
          :confirm-is-loading="isFetching"
          @cancel="handleClose"
          @confirm="handleConfirm"
        />
      </div>
    </div>
  </div>

  <ConfirmationModal
    :opened="closeConfirmationModalOpened"
    @close="closeCloseConfirmationModal"
    @confirm="handleConfirmCloseModal"
  />

  <ConfirmUpdateTraceModal
    :opened="confirmUpdateModalOpened"
    :locked-declared-activities="lockedDeclaredActivities"
    @close="closeConfirmUpdateModal"
    @confirm="handleConfirmSaveModal"
  />
</template>
