<script setup lang="ts">
import ErrorMessage from '@/common/components/feedback/ErrorMessage/ErrorMessage.vue'
import Loader from '@/common/components/Loader/Loader.vue'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { useModal, useNavigation } from '@/common/composables'
import { ROUTES } from '@/common/constants'
import { ICONS } from '@/features/student/global/icons'
import TraceAssociations from '@/features/student/traces/components/composites/TraceAssociations/TraceAssociations.vue'
import { useTraceAssociationsQuery, useTraceDetailedQuery } from '@/features/student/traces/queries/use-traces.query/use-traces.query'
import { useTracesStore } from '@/features/student/traces/stores/traces.store'
import StudentDetailedTraceAssociateModal
  from '@/features/student/traces/views/StudentToolsTracesView/components/StudentDetailedTraceAssociateModal/StudentDetailedTraceAssociateModal.vue'
import StudentTraceDetails from '@/features/student/traces/views/StudentToolsTracesView/components/StudentTraceDetails/StudentTraceDetails.vue'
import TraceDeletionConfirmationModal from '@/features/student/traces/views/StudentTraceView/components/TraceDeletionConfirmationModal/TraceDeletionConfirmationModal.vue'
import TraceSettingsDropdown from '@/features/student/traces/views/StudentTraceView/components/TraceSettingsDropdown/TraceSettingsDropdown.vue'
import UpdateTraceModal from '@/features/student/traces/views/StudentTraceView/components/UpdateTraceModal/UpdateTraceModal.vue'
import { AvTab, AvTabs, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface StudentTraceDetailedProps {
  traceId: string
}

const props = defineProps<StudentTraceDetailedProps>()
const { traceId } = toRefs(props)

const { traceDetailed, error: traceDetailsError, isLoading } = useTraceDetailedQuery(traceId)
const { traceAssociations, error: associationsError } = useTraceAssociationsQuery(traceId)
const { navigateToStudentTraces } = useNavigation()

const countAssociations = computed(() => !traceAssociations.value ? 0 : traceAssociations.value.declaredActivityAssociations.length + traceAssociations.value.declaredSkillAssociations.length)

const { t } = useI18n()
const {
  showModal: showDeleteModal,
  displayModal: displayDeleteModal,
  hideModal: hideDeleteModal
} = useModal()

const { displayUpdateTraceModal } = useTracesStore()

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

const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.tools.header') },
  { text: t('student.global.navigation.tabs.tools.items.traces'), to: ROUTES.STUDENT.TOOLS_TRACES },
  { text: traceDetailed.value?.title || '' }
])
</script>

<template>
  <PageTitle
    :title="t('student.traces.views.StudentTraceView.title', { trace: traceDetailed?.title ?? '' })"
    :breadcrumb-links="breadcrumbLinks"
    :back="ROUTES.STUDENT.HOME"
  />

  <Loader :is-loading>
    <div
      v-if="!!traceDetailed"
      class="main-container"
    >
      <div class="av-row av-justify-between av-align-center av-pb-md">
        <h5 class="n5">
          {{ t('student.traces.views.StudentTraceView.subtitle') }} <span class="s1-regular">{{ traceDetailed.title }}</span>
        </h5>
        <TraceSettingsDropdown
          @delete-selected="displayDeleteModal"
          @associate-selected="displayAssociateModal"
          @update-selected="displayUpdateTraceModal"
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
        >
          <div
            v-if="traceDetailsError"
            class="av-row av-px-2xl av-py-md av-justify-center"
          >
            <ErrorMessage
              :title="t('student.traces.views.StudentTraceView.errors.fetchTrace')"
              :description="traceDetailsError.message"
            />
          </div>

          <StudentTraceDetails :trace="traceDetailed" />
        </AvTab>
        <AvTab
          :title="t('student.traces.views.StudentTraceView.tabs.associations', { count: countAssociations })"
          :icon="ICONS.ASSOCIATIONS"
        >
          <div
            v-if="associationsError"
            class="av-row av-px-2xl av-py-md av-justify-center"
          >
            <ErrorMessage
              :title="t('student.traces.views.StudentTraceView.errors.fetchAssociations')"
              :description="associationsError.message"
            />
          </div>
          <TraceAssociations
            v-if="traceAssociations"
            :associations="traceAssociations"
            :trace-id="traceDetailed.id"
          />
        </AvTab>
      </AvTabs>

      <StudentDetailedTraceAssociateModal
        :trace="traceDetailed"
        :show="showAssociateModal"
        :on-close="() => hideAssociateModal()"
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
