<script setup lang="ts">
import { useTracesView } from '@/api/avenir-esr'
import { Pagination } from '@/common/components'
import { useBaseApiExceptionToast, usePagination } from '@/common/composables'
import { useTraceFilters } from '@/features/student/traces/composables/use-trace-filters/use-trace-filters'
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

const { data, error } = useTracesView(traceFilter, params)

const traces = computed(() => data.value?.data ?? [])
const pageInfo = computed(() => data.value?.page)

useBaseApiExceptionToast(error)

watch([
  () => tracesViewQueryParams.params.value,
  () => tracesViewQueryParams.traceFilter.value
], () => resetCurrentPage())
</script>

<template>
  <div
    class="av-col av-w-full av-gap-lg"
    data-testid="associated-traces-tab"
  >
    <TraceFilterContainer
      :is-associated="true"
      @update:filters="onUpdateFilters"
    />
    <Pagination
      v-if="traces.length > 0 && pageInfo"
      :page-info="pageInfo"
      :page-size-selected="pageSizeSelected"
      :on-update-current-page="onUpdateCurrentPage"
      :on-update-page-size="onUpdatePageSize"
    >
      <div class="av-row av-align-center av-justify-between av-w-full av-gap-sm av-wrap">
        <StudentDetailedTraceCard
          v-for="trace in traces"
          :key="trace.id"
          :trace="trace"
          data-testid="associated-trace-card"
          :data-trace-id="trace.id"
        />
      </div>
    </Pagination>
    <div
      v-else
      class="av-pb-5xl"
    >
      <span class="b2-regular">
        {{ t('student.traces.views.StudentToolsTracesView.studentToolsTracesViewTabs.noTraceFound') }}
      </span>
    </div>
  </div>
</template>
