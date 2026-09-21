<script lang="ts" setup>
import { useGetTracesSummary } from '@/api/avenir-esr'
import StudentToolsTracesAddTraceDrawer
  from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/StudentToolsTracesAddTraceDrawer.vue'
import StudentToolsTracesViewTabs
  from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesViewTabs/StudentToolsTracesViewTabs.vue'

const { data: tracesSummary } = useGetTracesSummary()
</script>

<template>
  <div class="av-col av-w-full av-gap-lg">
    <StudentToolsTracesViewTabs :traces-summary="tracesSummary" />

    <StudentToolsTracesAddTraceDrawer />
  </div>
</template>
