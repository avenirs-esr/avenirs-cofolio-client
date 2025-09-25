<script lang="ts" setup>
import StudentToolsTracesActionButtons
  from '@/features/student/views/StudentToolsTracesView/components/StudentToolsTracesActionButtons/StudentToolsTracesActionButtons.vue'
import StudentToolsTracesAddTraceDrawer
  from '@/features/student/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/StudentToolsTracesAddTraceDrawer.vue'
import StudentToolsTracesViewTabs
  from '@/features/student/views/StudentToolsTracesView/components/StudentToolsTracesViewTabs/StudentToolsTracesViewTabs.vue'
</script>

<template>
  <div class="student-tools-traces-view-container">
    <StudentToolsTracesActionButtons />
    <StudentToolsTracesViewTabs />

    <StudentToolsTracesAddTraceDrawer />
  </div>
</template>

<style lang="scss" scoped>
.student-tools-traces-view-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: var(--spacing-lg);
}
</style>
