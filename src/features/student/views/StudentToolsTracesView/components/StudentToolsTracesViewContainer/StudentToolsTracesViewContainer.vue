<script lang="ts" setup>
import { GetTracesViewStatus } from '@/api/avenir-esr'
import { Pagination } from '@/common/components'
import { useBaseApiExceptionToast, usePagination } from '@/common/composables'
import { useTracesViewQuery } from '@/features/student/queries'
import StudentDetailedTraceCard
  from '@/features/student/views/StudentToolsTracesView/components/StudentDetailedTracesCard/StudentDetailedTraceCard.vue'
import StudentToolsTracesActionButtons
  from '@/features/student/views/StudentToolsTracesView/components/StudentToolsTracesActionButtons/StudentToolsTracesActionButtons.vue'
import StudentToolsTracesAddTraceDrawer
  from '@/features/student/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/StudentToolsTracesAddTraceDrawer.vue'
import StudentToolsTracesViewNotice
  from '@/features/student/views/StudentToolsTracesView/components/StudentToolsTracesViewNotice/StudentToolsTracesViewNotice.vue'
import { useTracesStore } from '@/store'

const tracesStore = useTracesStore()
const {
  currentPage,
  pageSizeSelected,
  onUpdateCurrentPage,
  onUpdatePageSize
} = usePagination(toRef(tracesStore, 'currentPage'), toRef(tracesStore, 'pageSizeSelected'))

const { traces, pageInfo, error } = useTracesViewQuery({
  page: currentPage,
  pageSize: pageSizeSelected,
  status: GetTracesViewStatus.UNASSOCIATED
})

useBaseApiExceptionToast(error)
</script>

<template>
  <div class="student-tools-traces-view-container">
    <StudentToolsTracesActionButtons />
    <StudentToolsTracesViewNotice />
    <Pagination
      :page-info="pageInfo"
      :page-size-selected="pageSizeSelected"
      :on-update-current-page="onUpdateCurrentPage"
      :on-update-page-size="onUpdatePageSize"
    >
      <div class="detailed-cards-container">
        <StudentDetailedTraceCard
          v-for="trace in traces"
          :key="trace.id"
          :trace="trace"
        />
      </div>
    </Pagination>

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

.detailed-cards-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}
</style>
