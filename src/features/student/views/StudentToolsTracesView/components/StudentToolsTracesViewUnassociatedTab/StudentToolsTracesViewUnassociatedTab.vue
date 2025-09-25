<script setup lang="ts">
import { GetTracesViewStatus, type TracesSummaryDTO } from '@/api/avenir-esr'
import { Pagination } from '@/common/components'
import { useBaseApiExceptionToast, usePagination } from '@/common/composables'
import { useTracesViewQuery } from '@/features/student/queries'
import StudentDetailedTraceCard
  from '@/features/student/views/StudentToolsTracesView/components/StudentDetailedTracesCard/StudentDetailedTraceCard.vue'
import StudentToolsTracesViewNotice
  from '@/features/student/views/StudentToolsTracesView/components/StudentToolsTracesViewNotice/StudentToolsTracesViewNotice.vue'
import { useTracesStore } from '@/store'

defineProps<{
  tracesSummary: TracesSummaryDTO | undefined
}>()

const tracesStore = useTracesStore()
const {
  currentPage,
  pageSizeSelected,
  onUpdateCurrentPage,
  onUpdatePageSize
} = usePagination(toRef(tracesStore, 'unassociatedCurrentPage'), toRef(tracesStore, 'unassociatedPageSizeSelected'))
const tracesViewQueryParams = {
  page: currentPage,
  pageSize: pageSizeSelected,
  status: GetTracesViewStatus.UNASSOCIATED
}
const { traces, pageInfo, error } = useTracesViewQuery(tracesViewQueryParams)
useBaseApiExceptionToast(error)
</script>

<template>
  <div class="student-tools-traces-view-tabs-container">
    <StudentToolsTracesViewNotice :traces-summary="tracesSummary" />
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
  </div>
</template>

<style scoped lang="scss">
.student-tools-traces-view-tabs-container {
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
