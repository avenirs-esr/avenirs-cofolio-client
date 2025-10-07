<script setup lang="ts">
import type { TraceFilter } from '@/api/avenir-esr'
import type { DateFilter } from '@/types'
import { Pagination } from '@/common/components'
import { useBaseApiExceptionToast, usePagination } from '@/common/composables'
import { useTraceFilters } from '@/features/student/composables'
import { useTracesViewQuery, type UseTracesViewQueryParams } from '@/features/student/queries'
import StudentDetailedTraceCard
  from '@/features/student/views/StudentToolsTracesView/components/StudentDetailedTraceCard/StudentDetailedTraceCard.vue'
import StudentTraceFilters
  from '@/features/student/views/StudentToolsTracesView/components/StudentTraceFilters/StudentTraceFilters.vue'
import TraceFilterContainer from '@/features/student/views/StudentToolsTracesView/components/TraceFilterContainer/TraceFilterContainer.vue'
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

const { traceFilter: traceFilterComposable, handleChangeTraceFilter } = useTraceFilters()

const traceFilter = ref<TraceFilter>({ isAssociated: true })
const fromDateFilter = ref<DateFilter['fromDate']>(undefined)
const toDateFilter = ref<DateFilter['toDate']>(undefined)

const tracesViewQueryParams: UseTracesViewQueryParams = {
  traceFilter,
  fromDate: fromDateFilter,
  toDate: toDateFilter,
  page: currentPage,
  pageSize: pageSizeSelected,
}
const { traces, pageInfo, error, refetch } = useTracesViewQuery(tracesViewQueryParams)
useBaseApiExceptionToast(error)

function onFiltersUpdated (newFilters: Partial<TraceFilter> & Partial<DateFilter>) {
  const traceFilterKeys: (keyof TraceFilter)[] = ['fileTypes', 'statuses', 'skillIds']
  const dateFilterKeys: (keyof DateFilter)[] = ['fromDate', 'toDate']

  const traceFilterUpdates: Partial<TraceFilter> = {}
  const dateFilterUpdates: Partial<DateFilter> = {}

  for (const key in newFilters) {
    if (traceFilterKeys.includes(key as keyof TraceFilter)) {
      traceFilterUpdates[key as keyof TraceFilter] = newFilters[key as keyof typeof newFilters] as any
    }
    if (dateFilterKeys.includes(key as keyof DateFilter)) {
      dateFilterUpdates[key as keyof DateFilter] = newFilters[key as keyof typeof newFilters] as any
    }
  }

  traceFilter.value = { ...traceFilter.value, ...traceFilterUpdates }
  fromDateFilter.value = dateFilterUpdates.fromDate
  toDateFilter.value = dateFilterUpdates.toDate

  refetch()
}
</script>

<template>
  <div class="student-tools-traces-view-tabs-container">
    <StudentTraceFilters
      :search-label="t('student.views.studentToolsTracesView.studentToolsTracesViewTabs.associatedTracesTab.studentTraceFilters.searchLabel')"
      @change-trace-filter="handleChangeTraceFilter"
    />
    <TraceFilterContainer
      @filters-updated="onFiltersUpdated"
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
