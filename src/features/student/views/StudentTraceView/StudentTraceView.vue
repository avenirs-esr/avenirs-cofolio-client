<script setup lang="ts">
import { PageTitle } from '@/common/components'
import { useBaseApiExceptionToast, useModal } from '@/common/composables'
import { studentHomeRoute, studentToolsTracesRoute } from '@/features/student'
import { useTraceAssociationsQuery, useTraceDetailedQuery } from '@/features/student/queries'
import StudentTraceAssociations from '@/features/student/views/StudentToolsTracesView/components/StudentTraceAssociations/StudentTraceAssociations.vue'
import StudentTraceDetails from '@/features/student/views/StudentToolsTracesView/components/StudentTraceDetails/StudentTraceDetails.vue'
import TraceDeletionConfirmationModal from '@/features/student/views/StudentTraceView/components/TraceDeletionConfirmationModal/TraceDeletionConfirmationModal.vue'
import TraceSettingsPopover from '@/features/student/views/StudentTraceView/components/TraceSettingsPopover/TraceSettingsPopover.vue'
import UpdateTraceModal from '@/features/student/views/StudentTraceView/components/UpdateTraceModal/UpdateTraceModal.vue'
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
const {
  showModal: showUpdateModal,
  displayModal: displayUpdateModal,
  hideModal: hideUpdateModal
} = useModal()

const activeTab = ref(0)
const isAssociationsTabActive = computed(() => activeTab.value === 1)

const { skillLevelAssociations, additionalSkillAssociations } = useTraceAssociationsQuery(traceId, isAssociationsTabActive)

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

    <AvTabs
      v-model="activeTab"
      v-memo="[traceDetailed, skillLevelAssociations, additionalSkillAssociations]"
      class="trace-tabs"
      compact
    >
      <AvTab
        :title="t('student.views.studentTraceView.tabs.details')"
        :icon="MDI_ICONS.ATTACH_FILE"
      >
        <StudentTraceDetails
          v-if="!isAssociationsTabActive"
          :trace="traceDetailed"
        />
      </AvTab>
      <AvTab
        :title="t('student.views.studentTraceView.tabs.associations')"
        :icon="MDI_ICONS.LINK"
      >
        <StudentTraceAssociations
          v-if="isAssociationsTabActive"
          :skill-level-associations="skillLevelAssociations"
          :additional-skill-associations="additionalSkillAssociations"
        />
      </AvTab>
    </AvTabs>

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
  padding-bottom: var(--spacing-md);
}

.trace-tabs {
  flex: 1;
  overflow-y: auto;
  height: auto;
}
</style>
