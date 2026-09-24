<script setup lang="ts">
import type { BaseApiException } from '@/common/exceptions'
import { EAssociationContextType, useDownloadAttachment, useGetAssociations, useGetTraceDetail } from '@/api/avenir-esr'
import DetailedPageTitle from '@/common/components/DetailedPageTitle/DetailedPageTitle.vue'
import ErrorMessage from '@/common/components/feedback/ErrorMessage/ErrorMessage.vue'
import Loader from '@/common/components/Loader/Loader.vue'
import { useModal, useNavigation } from '@/common/composables'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { ICONS, ROUTES } from '@/common/constants'
import { downloadBlob } from '@/common/utils/download/download'
import { AssociateModal, countElementAssociations, ElementAssociations } from '@/features/student/associations'
import TraceDeletionConfirmationModal from '@/features/student/traces/components/modals/TraceDeletionConfirmationModal/TraceDeletionConfirmationModal.vue'
import StudentTraceDetails from '@/features/student/traces/components/StudentTraceDetails/StudentTraceDetails.vue'
import TraceSettingsDropdown from '@/features/student/traces/views/StudentTraceView/components/TraceSettingsDropdown/TraceSettingsDropdown.vue'
import { useToasterStore } from '@/store'
import { AvTab, AvTabs, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface StudentTraceDetailedProps {
  traceId: string
}

const props = defineProps<StudentTraceDetailedProps>()
const { traceId } = toRefs(props)
const { getErrorMessage } = useApiErrors()
const { addErrorMessage } = useToasterStore()
const { t } = useI18n()

const {
  modalOpened: deleteModalOpened,
  openModal: openDeleteModal,
  closeModal: closeDeleteModal
} = useModal()

const { data: traceDetailed, error: traceDetailsError, isLoading } = useGetTraceDetail(traceId)
const { data: traceAssociations, error: associationsError, isLoading: isAssociationsLoading } = useGetAssociations(EAssociationContextType.TRACE, traceId)

const selectedTraceIdsForDeletion = computed(() =>
  traceDetailed.value ? [traceDetailed.value.id] : []
)

const { navigateToStudentTraces, navigateToStudentUpdateTrace, navigateToStudentToolsUpdateTrace, navigateToStudentToolsKitUpdateTrace } = useNavigation()
const route = useRoute()

const associationsCount = computed(() => countElementAssociations(EAssociationContextType.TRACE, traceAssociations.value))

const { mutate: mutateDownloadAttachment } = useDownloadAttachment()

function downloadAttachment (traceId: string) {
  mutateDownloadAttachment({ traceId }, {
    onError: (error: BaseApiException) => {
      addErrorMessage({
        title: t('student.traces.views.StudentTraceView.errors.download'),
        description: getErrorMessage(error)
      })
    },
    onSuccess: data => downloadBlob(data, traceDetailed.value?.attachment?.fileName)
  })
}

const {
  modalOpened: associateModalOpened,
  openModal: openAssociateModal,
  closeModal: closeAssociateModal
} = useModal()

const activeTab = ref(0)

function onDeleteTraceSuccess () {
  closeDeleteModal()
  navigateToStudentTraces({ replace: true })
}

const isToolsTraceRoute = computed(() => route.name === ROUTES.STUDENT.TOOLS_TRACE.name)

const isToolsKitTraceRoute = computed(() =>
  route.name === ROUTES.STUDENT.TOOLS_KIT_TRACE.name)

function handleUpdateTrace () {
  const id = traceDetailed.value!.id

  if (isToolsKitTraceRoute.value) {
    navigateToStudentToolsKitUpdateTrace({ id, })
  }
  else if (isToolsTraceRoute.value) {
    navigateToStudentToolsUpdateTrace({ id, })
  }
  else {
    navigateToStudentUpdateTrace({ id, })
  }
}

const trailingLinks = computed(() => [
  { text: traceDetailed.value?.title || '' }
])
</script>

<template>
  <DetailedPageTitle
    :title="traceDetailed?.title ?? ''"
    :trailing-links="trailingLinks"
  >
    <template #actions>
      <TraceSettingsDropdown
        v-if="!!traceDetailed"
        :download-disabled="!traceDetailed.attachment"
        @delete="openDeleteModal"
        @associate="openAssociateModal"
        @update="handleUpdateTrace"
        @download="downloadAttachment(traceDetailed.id)"
      />
    </template>
  </DetailedPageTitle>

  <Loader :is-loading>
    <div
      v-if="!!traceDetailed"
      class="main-container"
      data-testid="trace-detailed-main-container"
    >
      <AvTabs
        v-model="activeTab"
        v-memo="[traceDetailed, activeTab, traceDetailsError, associationsError]"
        class="trace-tabs"
      >
        <AvTab
          :title="t('student.traces.views.StudentTraceView.tabs.details')"
          :icon="MDI_ICONS.INFORMATION_OUTLINE"
          data-testid="my-trace-tab-item"
        >
          <div
            v-if="traceDetailsError"
            class="av-row av-px-2xl av-py-md av-justify-center"
          >
            <ErrorMessage
              :title="t('student.traces.views.StudentTraceView.errors.fetchTrace')"
              :description="getErrorMessage(traceDetailsError)"
            />
          </div>

          <StudentTraceDetails :trace="traceDetailed" />
        </AvTab>

        <AvTab
          :title="t('student.traces.views.StudentTraceView.tabs.associations', { count: associationsCount })"
          :icon="ICONS.ASSOCIATIONS"
          data-testid="associations-tab-item"
        >
          <Loader :is-loading="isAssociationsLoading">
            <ElementAssociations
              :context-type="EAssociationContextType.TRACE"
              :element-id="traceDetailed.id"
              :associations="traceAssociations"
              :error="associationsError"
            />
          </Loader>
        </AvTab>
      </AvTabs>

      <AssociateModal
        :opened="associateModalOpened"
        :context-type="EAssociationContextType.TRACE"
        :element-id="traceDetailed.id"
        :associated-context-type="EAssociationContextType.DECLARED_SKILL"
        @cancel="closeAssociateModal"
        @associated="closeAssociateModal"
      />

      <TraceDeletionConfirmationModal
        :trace-ids="selectedTraceIdsForDeletion"
        :title="traceDetailed.title"
        :opened="deleteModalOpened"
        :on-confirm-delete="onDeleteTraceSuccess"
        :on-close="closeDeleteModal"
      />
    </div>
  </Loader>
</template>
