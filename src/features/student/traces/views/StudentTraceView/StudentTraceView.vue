<script setup lang="ts">
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { useBaseApiExceptionToast, useModal } from '@/common/composables'
import { ROUTES } from '@/common/constants'
import { ICONS } from '@/features/student/global/icons'
import TraceAssociations from '@/features/student/traces/components/composites/TraceAssociations/TraceAssociations.vue'
import { useTraceDetailedQuery } from '@/features/student/traces/queries/use-traces.query/use-traces.query'
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

  <div
    v-if="!!traceDetailed"
    class="main-container"
  >
    <div class="av-row av-justify-between av-align-center av-pb-md">
      <h5 class="n5">
        {{ t('student.traces.views.StudentTraceView.subtitle') }} <span class="s1-regular">{{ traceDetailed?.title }}</span>
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
    >
      <AvTab
        :title="t('student.traces.views.StudentTraceView.tabs.details')"
        :icon="MDI_ICONS.INFORMATION_OUTLINE"
      >
        <StudentTraceDetails
          :trace="traceDetailed"
        />
      </AvTab>
      <AvTab
        :title="t('student.traces.views.StudentTraceView.tabs.associations')"
        :icon="ICONS.ASSOCIATIONS"
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
.trace-tabs {
  overflow-y: auto;
  height: auto;
}
</style>
