<script setup lang="ts">
import { useTracesSummaryQuery } from '@/features/student/queries'
import StudentToolsTracesViewAssociatedTab
  from '@/features/student/views/StudentToolsTracesView/components/StudentToolsTracesViewAssociatedTab/StudentToolsTracesViewAssociatedTab.vue'
import StudentToolsTracesViewUnassociatedTab
  from '@/features/student/views/StudentToolsTracesView/components/StudentToolsTracesViewUnassociatedTab/StudentToolsTracesViewUnassociatedTab.vue'
import { AvTab, AvTabs, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { data: tracesSummary } = useTracesSummaryQuery()

const activeTab = ref(0)
</script>

<template>
  <AvTabs v-model="activeTab">
    <AvTab
      :title="`${t('student.views.studentToolsTracesView.studentToolsTracesViewTabs.unassociated', { count: tracesSummary?.unassociated ?? 0 })}`"
      :icon="MDI_ICONS.ALERT_OUTLINE"
    >
      <StudentToolsTracesViewUnassociatedTab :traces-summary="tracesSummary" />
    </AvTab>
    <AvTab
      :title="`${t('student.views.studentToolsTracesView.studentToolsTracesViewTabs.associated', { count: tracesSummary?.associated ?? 0 })}`"
      :icon="MDI_ICONS.LINK"
    >
      <StudentToolsTracesViewAssociatedTab />
    </AvTab>
  </AvTabs>
</template>

<style lang="scss" scoped>

</style>
