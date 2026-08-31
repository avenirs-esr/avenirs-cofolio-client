<script lang="ts" setup>
import { useGetTracesSummary } from '@/api/avenir-esr'
import StudentToolsTracesActionButtons
  from '@/features/traces/views/StudentToolsTracesView/components/StudentToolsTracesActionButtons/StudentToolsTracesActionButtons.vue'
import StudentToolsTracesAddTraceDrawer
  from '@/features/traces/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/StudentToolsTracesAddTraceDrawer.vue'
import StudentToolsTracesViewTabs
  from '@/features/traces/views/StudentToolsTracesView/components/StudentToolsTracesViewTabs/StudentToolsTracesViewTabs.vue'
import TracesInformation from '@/features/traces/views/StudentToolsTracesView/components/TracesInformation/TracesInformation.vue'

const { data: tracesSummary } = useGetTracesSummary()
</script>

<template>
  <div class="av-col av-w-full av-gap-lg">
    <TracesInformation />
    <StudentToolsTracesActionButtons :traces-summary="tracesSummary" />
    <StudentToolsTracesViewTabs :traces-summary="tracesSummary" />

    <StudentToolsTracesAddTraceDrawer />
  </div>
</template>
