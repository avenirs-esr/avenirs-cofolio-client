<script setup lang="ts">
import { useTracesSummaryQuery } from '@/features/student/traces/queries/use-traces.query/use-traces.query'
import StudentToolsTracesViewAssociatedTab
  from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesViewAssociatedTab/StudentToolsTracesViewAssociatedTab.vue'
import StudentToolsTracesViewUnassociatedTab
  from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesViewUnassociatedTab/StudentToolsTracesViewUnassociatedTab.vue'
import { AvTab, AvTabs, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const activeTab = defineModel<number>()

const { t } = useI18n()
const { data: tracesSummary } = useTracesSummaryQuery()
</script>

<template>
  <AvTabs v-model="activeTab">
    <AvTab
      :title="`${t('student.traces.views.StudentToolsTracesView.studentToolsTracesViewTabs.unassociatedTracesTab.title', { count: tracesSummary?.unassociated ?? 0 })}`"
      :icon="MDI_ICONS.ALERT_OUTLINE"
      data-testid="unassociated-traces-tab-item"
    >
      <StudentToolsTracesViewUnassociatedTab :traces-summary="tracesSummary" />
    </AvTab>
    <AvTab
      :title="`${t('student.traces.views.StudentToolsTracesView.studentToolsTracesViewTabs.associatedTracesTab.title', { count: tracesSummary?.associated ?? 0 })}`"
      :icon="MDI_ICONS.LINK"
      data-testid="associated-traces-tab-item"
    >
      <StudentToolsTracesViewAssociatedTab />
    </AvTab>
  </AvTabs>
</template>

<style lang="scss" scoped>

</style>
