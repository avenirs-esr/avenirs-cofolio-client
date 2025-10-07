<script setup lang="ts">
import { GetTracesViewStatus } from '@/api/avenir-esr'
import { Pagination } from '@/common/components'
import { useBaseApiExceptionToast, usePagination } from '@/common/composables'
import { useTraceFilters } from '@/features/student/composables'
import { useTracesViewQuery } from '@/features/student/queries'
import StudentDetailedTraceCard
  from '@/features/student/views/StudentToolsTracesView/components/StudentDetailedTraceCard/StudentDetailedTraceCard.vue'
import StudentTraceFilters
  from '@/features/student/views/StudentToolsTracesView/components/StudentTraceFilters/StudentTraceFilters.vue'
import { useTracesStore } from '@/store'
import { useI18n } from 'vue-i18n'

const tracesStore = useTracesStore()

const { t } = useI18n()

const {
  currentPage,
  pageSizeSelected,
  onUpdateCurrentPage,
  onUpdatePageSize
} = usePagination(toRef(tracesStore, 'associatedCurrentPage'), toRef(tracesStore, 'associatedPageSizeSelected'))

const { traceFilter, handleChangeTraceFilter } = useTraceFilters()

const tracesViewParams = computed(() => ({
  page: currentPage.value,
  pageSize: pageSizeSelected.value,
  status: GetTracesViewStatus.ASSOCIATED,
  keyword: traceFilter.value.keyword
}))

const { traces, pageInfo, error } = useTracesViewQuery({
  params: tracesViewParams
})
useBaseApiExceptionToast(error)
</script>

<template>
  <div class="student-tools-traces-view-tabs-container">
    <StudentTraceFilters
      :search-label="t('student.views.studentToolsTracesView.studentToolsTracesViewTabs.associatedTracesTab.studentTraceFilters.searchLabel')"
      @change-trace-filter="handleChangeTraceFilter"
    />
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
