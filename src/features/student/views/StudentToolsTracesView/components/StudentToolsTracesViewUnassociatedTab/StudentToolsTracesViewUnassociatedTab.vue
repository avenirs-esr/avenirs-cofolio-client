<script setup lang="ts">
import type { TraceFilter, TracesSummaryDTO } from '@/api/avenir-esr'
import { Pagination } from '@/common/components'
import { useBaseApiExceptionToast, usePagination } from '@/common/composables'
import { useTraceFilters } from '@/features/student/composables'
import { useTracesViewQuery } from '@/features/student/queries'
import StudentDetailedTraceCard
  from '@/features/student/views/StudentToolsTracesView/components/StudentDetailedTraceCard/StudentDetailedTraceCard.vue'
import StudentToolsTracesViewNotice
  from '@/features/student/views/StudentToolsTracesView/components/StudentToolsTracesViewNotice/StudentToolsTracesViewNotice.vue'
import StudentTraceFilters
  from '@/features/student/views/StudentToolsTracesView/components/StudentTraceFilters/StudentTraceFilters.vue'
import { useTracesStore } from '@/store'
import { useI18n } from 'vue-i18n'

defineProps<{
  tracesSummary: TracesSummaryDTO | undefined
}>()

const tracesStore = useTracesStore()

const { t } = useI18n()

const {
  currentPage,
  pageSizeSelected,
  onUpdateCurrentPage,
  onUpdatePageSize
} = usePagination(toRef(tracesStore, 'unassociatedCurrentPage'), toRef(tracesStore, 'unassociatedPageSizeSelected'))

const { traceFilter, handleChangeTraceFilter } = useTraceFilters()

const tracesViewQueryParams = {
  traceFilter: ref<TraceFilter>({}),
  page: currentPage,
  pageSize: pageSizeSelected,
}
const { traces, pageInfo, error } = useTracesViewQuery(tracesViewQueryParams)
useBaseApiExceptionToast(error)
</script>

<template>
  <div class="student-tools-traces-view-tabs-container">
    <StudentTraceFilters
      :search-label="t('student.views.studentToolsTracesView.studentToolsTracesViewTabs.unassociatedTracesTab.studentTraceFilters.searchLabel')"
      @change-trace-filter="handleChangeTraceFilter"
    />
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
  justify-content: space-between;
  width: 100%;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}
</style>
