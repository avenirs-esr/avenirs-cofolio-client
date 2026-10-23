<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useGetTracesSummary } from '@/api/avenir-esr'
import PageTitle from '@/common/components/navigation/PageTitle/PageTitle.vue'
import StudentToolsTracesActionButtons from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesActionButtons/StudentToolsTracesActionButtons.vue'
import StudentToolsTracesViewContainer from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesViewContainer/StudentToolsTracesViewContainer.vue'

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

  <input
    type="text"
    data-testid="ci-a11y-report-probe"
  >

  <StudentToolsTracesViewContainer />
</template>
