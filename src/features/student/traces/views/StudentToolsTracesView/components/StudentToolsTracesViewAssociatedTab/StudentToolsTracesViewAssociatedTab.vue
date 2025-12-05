<script setup lang="ts">
import { Pagination } from '@/common/components'
import { useBaseApiExceptionToast, usePagination } from '@/common/composables'
import { useTraceFilters } from '@/features/student/traces/composables/use-trace-filters/use-trace-filters'
import { useTracesViewQuery } from '@/features/student/traces/queries/use-traces.query/use-traces.query'
import { useTracesStore } from '@/features/student/traces/stores/traces.store'
import StudentDetailedTraceCard
  from '@/features/student/traces/views/StudentToolsTracesView/components/StudentDetailedTraceCard/StudentDetailedTraceCard.vue'
import TraceFilterContainer from '@/features/student/traces/views/StudentToolsTracesView/components/TraceFilterContainer/TraceFilterContainer.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const tracesStore = useTracesStore()

const {
  currentPage,
  pageSizeSelected,
  onUpdateCurrentPage,
  onUpdatePageSize,
  resetCurrentPage
} = usePagination(toRef(tracesStore, 'associatedCurrentPage'), toRef(tracesStore, 'associatedPageSizeSelected'))

const { tracesViewQueryParams, onUpdateFilters } = useTraceFilters({ isAssociated: true })

const traceFilter = computed(() => tracesViewQueryParams.traceFilter.value)
const params = computed(() => ({
  ...tracesViewQueryParams.params.value,
  page: currentPage.value,
  pageSize: pageSizeSelected.value
}))

const { traces, pageInfo, error } = useTracesViewQuery({ traceFilter, params })
useBaseApiExceptionToast(error)

watch([
  () => tracesViewQueryParams.params.value,
  () => tracesViewQueryParams.traceFilter.value
], () => resetCurrentPage())
</script>

<template>
  <div class="student-tools-traces-view-tabs-container">
    <TraceFilterContainer
      :is-associated="true"
      @update:filters="onUpdateFilters"
    />
    <Pagination
      v-if="traces.length > 0"
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
    <div
      v-else
      class="no-result-container"
    >
      <span class="b2-regular">
        {{ t('student.traces.views.StudentToolsTracesView.studentToolsTracesViewTabs.noTraceFound') }}
      </span>
    </div>
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
  justify-content: space-between;
}

.no-result-container {
  padding-bottom: var(--dimension-7xl);
}
</style>
