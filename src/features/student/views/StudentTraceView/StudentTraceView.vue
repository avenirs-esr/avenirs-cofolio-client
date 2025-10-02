<script setup lang="ts">
import { PageTitle } from '@/common/components'
import { useBaseApiExceptionToast, useModal } from '@/common/composables'
import { studentHomeRoute, studentToolsTracesRoute } from '@/features/student'
import { useTraceDetailedQuery } from '@/features/student/queries'
import TraceDeletionConfirmationModal from '@/features/student/views/StudentTraceView/components/TraceDeletionConfirmationModal/TraceDeletionConfirmationModal.vue'
import TraceSettingsPopover from '@/features/student/views/StudentTraceView/components/TraceSettingsPopover/TraceSettingsPopover.vue'
import UpdateTraceModal from '@/features/student/views/StudentTraceView/components/UpdateTraceModal/UpdateTraceModal.vue'
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
const {
  showModal: showUpdateModal,
  displayModal: displayUpdateModal,
  hideModal: hideUpdateModal
} = useModal()

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
      <TraceSettingsPopover
        @delete-selected="displayDeleteModal"
        @update-selected="displayUpdateModal"
      />
    </div>

    <div class="body">
      <div class="content">
        Placeholder...
      </div>
    </div>

    <TraceDeletionConfirmationModal
      :trace="traceDetailed"
      :show="showDeleteModal"
      :on-confirm-delete="() => onDeleteTraceSuccess()"
      :on-close="() => hideDeleteModal()"
    />

    <UpdateTraceModal
      :trace="traceDetailed"
      :show="showUpdateModal"
      :on-close="() => hideUpdateModal()"
    />
  </div>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.body {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
}

.content {
  flex: 1;
  overflow-y: auto;
}
</style>
