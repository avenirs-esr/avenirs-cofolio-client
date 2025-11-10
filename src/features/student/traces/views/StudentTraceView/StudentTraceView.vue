<script setup lang="ts">
import { PageTitle } from '@/common/components'
import { useBaseApiExceptionToast, useModal } from '@/common/composables'
import { studentHomeRoute } from '@/features/student/routes'
import { useTracesStore } from '@/features/student/traces'
import TraceAssociations from '@/features/student/traces/components/composites/TraceAssociations/TraceAssociations.vue'
import { useTraceDetailedQuery } from '@/features/student/traces/queries/use-traces.query/use-traces.query'
import { studentToolsTracesRoute } from '@/features/student/traces/routes'
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

const { traceDetailed, error } = useTraceDetailedQuery(traceId)
useBaseApiExceptionToast(error)

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
}

const breadcrumbLinks = computed(() => [
  { text: t('student.navigation.tabs.home'), to: studentHomeRoute },
  { text: t('student.navigation.tabs.tools.header') },
  { text: t('student.navigation.tabs.tools.items.traces'), to: studentToolsTracesRoute },
  { text: traceDetailed.value?.title || '' }
])
</script>

<template>
  <PageTitle
    :title="t('student.views.studentTraceView.title', { trace: traceDetailed?.title ?? '' })"
    :breadcrumb-links="breadcrumbLinks"
    :back="studentHomeRoute"
  />

  <div
    v-if="!!traceDetailed"
    class="main-container"
  >
    <div class="header">
      <h5 class="n5">
        {{ t('student.views.studentTraceView.subtitle') }} <span class="s1-regular">{{ traceDetailed?.title }}</span>
      </h5>
      <TraceSettingsDropdown
        @delete-selected="displayDeleteModal"
        @associate-selected="displayAssociateModal"
        @update-selected="displayUpdateTraceModal"
      />
    </div>

    <AvTabs
      v-model="activeTab"
      v-memo="[traceDetailed, activeTab]"
      class="trace-tabs"
      compact
    >
      <AvTab
        :title="t('student.views.studentTraceView.tabs.details')"
        :icon="MDI_ICONS.ATTACH_FILE"
      >
        <StudentTraceDetails
          :trace="traceDetailed"
        />
      </AvTab>
      <AvTab
        :title="t('student.views.studentTraceView.tabs.associations')"
        :icon="MDI_ICONS.LINK"
      >
        <TraceAssociations
          :associations="traceDetailed.traceAssociations"
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
      :trace="traceDetailed"
    />
  </div>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--spacing-md);
}

.trace-tabs {
  flex: 1;
  overflow-y: auto;
  height: auto;
}
</style>
