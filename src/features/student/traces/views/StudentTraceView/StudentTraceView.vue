<script setup lang="ts">
import type { BaseApiException } from '@/common/exceptions'
import { useDownloadFile } from '@/api/avenir-esr'
import DetailedPageTitle from '@/common/components/DetailedPageTitle/DetailedPageTitle.vue'
import ErrorMessage from '@/common/components/feedback/ErrorMessage/ErrorMessage.vue'
import Loader from '@/common/components/Loader/Loader.vue'
import { useModal, useNavigation } from '@/common/composables'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { ICONS, ROUTES } from '@/common/constants'
import { downloadBlob } from '@/common/utils/download/download'
import TraceAssociations from '@/features/student/traces/components/composites/TraceAssociations/TraceAssociations.vue'
import { useTraceAssociationsQuery, useTraceDetailedQuery } from '@/features/student/traces/queries/use-traces.query/use-traces.query'
import { useTracesStore } from '@/features/student/traces/stores/traces.store'
import StudentTraceDetails from '@/features/student/traces/views/StudentToolsTracesView/components/StudentTraceDetails/StudentTraceDetails.vue'
import AssociateDeclaredSkillsToTracesModal from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/AssociateDeclaredSkillsToTracesModal/AssociateDeclaredSkillsToTracesModal.vue'
import TraceDeletionConfirmationModal from '@/features/student/traces/views/StudentTraceView/components/TraceDeletionConfirmationModal/TraceDeletionConfirmationModal.vue'
import TraceSettingsDropdown from '@/features/student/traces/views/StudentTraceView/components/TraceSettingsDropdown/TraceSettingsDropdown.vue'
import UpdateTraceModal from '@/features/student/traces/views/StudentTraceView/components/UpdateTraceModal/UpdateTraceModal.vue'
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

const { traceDetailed, error: traceDetailsError, isLoading } = useTraceDetailedQuery(traceId)
const { traceAssociations, error: associationsError, isLoading: isAssociationsLoading } = useTraceAssociationsQuery(traceId)
const { navigateToStudentTraces } = useNavigation()
const route = useRoute()

const countAssociations = computed(() => !traceAssociations.value ? 0 : traceAssociations.value.declaredActivityAssociations.length + traceAssociations.value.declaredSkillAssociations.length)

const { t } = useI18n()
const {
  showModal: showDeleteModal,
  displayModal: displayDeleteModal,
  hideModal: hideDeleteModal
} = useModal()

const { displayUpdateTraceModal } = useTracesStore()
const { mutate: mutateDownloadAttachment } = useDownloadFile()

function downloadAttachment (fileId: string) {
  mutateDownloadAttachment({ fileId }, {
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
  showModal: showAssociateModal,
  displayModal: displayAssociateModal,
  hideModal: hideAssociateModal
} = useModal()

const activeTab = ref(0)

function onDeleteTraceSuccess () {
  hideDeleteModal()
  navigateToStudentTraces({ replace: true })
}

const isToolsTraceRoute = computed(() => route.name === ROUTES.STUDENT.TOOLS_TRACE.name)

const toolsBreadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.tools.header') },
  { text: t('student.global.navigation.tabs.tools.items.traces'), to: ROUTES.STUDENT.TOOLS_TRACES },
  { text: traceDetailed.value?.title || '' }
])

const homeBreadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.traces.views.StudentTraceView.breadcrumb.current.title', { trace: traceDetailed.value?.title || '' }) }
])

const breadcrumbLinks = computed(() => isToolsTraceRoute.value
  ? toolsBreadcrumbLinks.value
  : homeBreadcrumbLinks.value)
</script>

<template>
  <DetailedPageTitle
    :title="traceDetailed?.title ?? ''"
    :breadcrumb-links="breadcrumbLinks"
  />

  <Loader :is-loading>
    <div
      v-if="!!traceDetailed"
      class="main-container"
      data-testid="trace-detailed-main-container"
    >
      <div class="av-row av-justify-end av-pb-md">
        <TraceSettingsDropdown
          :download-disabled="!traceDetailed.attachment"
          @delete-selected="displayDeleteModal"
          @associate-selected="displayAssociateModal"
          @update-selected="displayUpdateTraceModal"
          @download-selected="downloadAttachment(traceDetailed.attachment?.id ?? '')"
        />
      </div>

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
          :title="t('student.traces.views.StudentTraceView.tabs.associations', { count: countAssociations })"
          :icon="ICONS.ASSOCIATIONS"
          data-testid="associations-tab-item"
        >
          <Loader :is-loading="isAssociationsLoading">
            <TraceAssociations
              :associations="traceAssociations"
              :trace-id="traceDetailed.id"
              :associations-error="associationsError"
              :count-associations="countAssociations"
            />
          </Loader>
        </AvTab>
      </AvTabs>

      <AssociateDeclaredSkillsToTracesModal
        :show="showAssociateModal"
        :trace-id="traceDetailed.id"
        @cancel="hideAssociateModal"
        @associated="hideAssociateModal"
      />

      <TraceDeletionConfirmationModal
        :trace="traceDetailed"
        :show="showDeleteModal"
        :on-confirm-delete="() => onDeleteTraceSuccess()"
        :on-close="() => hideDeleteModal()"
      />

      <UpdateTraceModal
        v-if="traceAssociations"
        :trace="traceDetailed"
        :associations="traceAssociations"
      />
    </div>
  </Loader>
</template>
