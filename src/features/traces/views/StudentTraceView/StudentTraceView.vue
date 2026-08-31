<script setup lang="ts">
import type { BaseApiException } from '@/common/exceptions'
import { useDownloadAttachment, useGetTraceAssociations, useGetTraceDetail } from '@/api/avenir-esr'
import DetailedPageTitle from '@/common/components/DetailedPageTitle/DetailedPageTitle.vue'
import ErrorMessage from '@/common/components/feedback/ErrorMessage/ErrorMessage.vue'
import Loader from '@/common/components/Loader/Loader.vue'
import { useModal, useNavigation } from '@/common/composables'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { ICONS, ROUTES } from '@/common/constants'
import { downloadBlob } from '@/common/utils/download/download'
import TraceAssociations from '@/features/traces/components/composites/TraceAssociations/TraceAssociations.vue'
import TraceDeletionConfirmationModal from '@/features/traces/components/modals/TraceDeletionConfirmationModal/TraceDeletionConfirmationModal.vue'
import StudentTraceDetails from '@/features/traces/views/StudentToolsTracesView/components/StudentTraceDetails/StudentTraceDetails.vue'
import AssociateDeclaredSkillsToTracesModal from '@/features/traces/views/StudentTraceView/components/overlays/modals/AssociateDeclaredSkillsToTracesModal/AssociateDeclaredSkillsToTracesModal.vue'
import TraceSettingsDropdown from '@/features/traces/views/StudentTraceView/components/TraceSettingsDropdown/TraceSettingsDropdown.vue'
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
  showModal: showDeleteModal,
  displayModal: displayDeleteModal,
  hideModal: hideDeleteModal
} = useModal()

const { data: traceDetailed, error: traceDetailsError, isLoading } = useGetTraceDetail(traceId)
const { data: traceAssociations, error: associationsError, isLoading: isAssociationsLoading } = useGetTraceAssociations(traceId)

const selectedTraceIdsForDeletion = computed(() =>
  traceDetailed.value ? [traceDetailed.value.id] : []
)

const { navigateToStudentTraces, navigateToStudentUpdateTrace, navigateToStudentToolsUpdateTrace } = useNavigation()
const route = useRoute()

const countAssociations = computed(() =>
  !traceAssociations.value
    ? 0
    : traceAssociations.value.declaredActivityAssociations.length
      + traceAssociations.value.declaredSkillAssociations.length
      + traceAssociations.value.declaredExperienceAssociations.length

)

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

function handleUpdateTrace () {
  if (isToolsTraceRoute.value) {
    navigateToStudentToolsUpdateTrace({
      id: traceDetailed.value!.id,
    })
  }
  else {
    navigateToStudentUpdateTrace({
      id: traceDetailed.value!.id,
    })
  }
}

const toolsBreadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.tools.header') },
  { text: t('student.global.navigation.tabs.tools.items.traces'), to: ROUTES.STUDENT.TOOLS_TRACES },
  { text: traceDetailed.value?.title || '' }
])

const homeBreadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.tools.items.traces') },
  { text: traceDetailed.value?.title || '' }
])

const breadcrumbLinks = computed(() =>
  isToolsTraceRoute.value
    ? toolsBreadcrumbLinks.value
    : homeBreadcrumbLinks.value
)
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
          @update-selected="handleUpdateTrace"
          @download-selected="downloadAttachment(traceDetailed.id)"
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
        :trace-ids="selectedTraceIdsForDeletion"
        :title="traceDetailed.title"
        :show="showDeleteModal"
        :on-confirm-delete="onDeleteTraceSuccess"
        :on-close="hideDeleteModal"
      />
    </div>
  </Loader>
</template>
