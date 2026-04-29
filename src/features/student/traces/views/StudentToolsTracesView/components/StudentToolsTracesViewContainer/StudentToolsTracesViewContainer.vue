<script lang="ts" setup>
import { useQueryParamIndex } from '@/common/composables/use-query-param-index/use-query-param-index'
import StudentToolsTracesActionButtons
  from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesActionButtons/StudentToolsTracesActionButtons.vue'
import StudentToolsTracesAddTraceDrawer
  from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/StudentToolsTracesAddTraceDrawer.vue'
import StudentToolsTracesViewTabs
  from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesViewTabs/StudentToolsTracesViewTabs.vue'

const studentToolsTracesTabs = ['education', 'other']
const activeStudentToolsTracesTab = useQueryParamIndex(studentToolsTracesTabs, 'tab')
</script>

<template>
  <div class="av-col av-w-full av-gap-lg">
    <StudentToolsTracesActionButtons />
    <StudentToolsTracesViewTabs
      v-model="activeStudentToolsTracesTab"
    />

    <StudentToolsTracesAddTraceDrawer />
  </div>
</template>
