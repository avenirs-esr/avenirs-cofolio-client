<script lang="ts" setup>
import { useQueryParamEnum } from '@/common/composables'
import StudentToolsTracesActionButtons
  from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesActionButtons/StudentToolsTracesActionButtons.vue'
import StudentToolsTracesAddTraceDrawer
  from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/StudentToolsTracesAddTraceDrawer.vue'
import StudentToolsTracesViewTabs
  from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesViewTabs/StudentToolsTracesViewTabs.vue'

enum StudentToolsTracesTabs {
  EDUCATION = 0,
  OTHER = 1
}
const activeStudentToolsTracesTab = useQueryParamEnum(StudentToolsTracesTabs, 'tab')
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
