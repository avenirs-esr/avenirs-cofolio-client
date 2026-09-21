<script setup lang="ts">
import { useGetTracesSummary } from '@/api/avenir-esr'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import StudentToolsTracesActionButtons from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesActionButtons/StudentToolsTracesActionButtons.vue'
import StudentToolsTracesViewContainer from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesViewContainer/StudentToolsTracesViewContainer.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { data: tracesSummary } = useGetTracesSummary()
</script>

<template>
  <PageTitle
    :title="t('student.traces.views.StudentToolsTracesView.title')"
    :information-tooltip="t('student.traces.views.StudentToolsTracesView.informationTooltip')"
  >
    <template #actions>
      <StudentToolsTracesActionButtons :traces-summary="tracesSummary" />
    </template>
  </PageTitle>

  <StudentToolsTracesViewContainer />
</template>
