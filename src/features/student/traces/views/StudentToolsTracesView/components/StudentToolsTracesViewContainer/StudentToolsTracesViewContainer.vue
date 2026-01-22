<script lang="ts" setup>
import StudentToolsTracesActionButtons
  from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesActionButtons/StudentToolsTracesActionButtons.vue'
import StudentToolsTracesAddTraceDrawer
  from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/StudentToolsTracesAddTraceDrawer.vue'
import StudentToolsTracesViewTabs
  from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesViewTabs/StudentToolsTracesViewTabs.vue'
</script>

<template>
  <div class="av-col av-w-full av-gap-lg">
    <StudentToolsTracesActionButtons />
    <StudentToolsTracesViewTabs />

    <StudentToolsTracesAddTraceDrawer />
  </div>
</template>
