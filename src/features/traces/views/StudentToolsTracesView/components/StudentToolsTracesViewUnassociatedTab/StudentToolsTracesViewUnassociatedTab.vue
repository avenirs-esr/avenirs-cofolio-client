<script setup lang="ts">
import { type TracesSummaryDTO, useTracesView } from '@/api/avenir-esr'
import { Pagination } from '@/common/components'
import { useBaseApiExceptionToast, usePagination } from '@/common/composables'
import { useTraceFilters } from '@/features/traces/composables/use-trace-filters/use-trace-filters'
import { useTracesStore } from '@/features/traces/stores/traces.store'
import StudentDetailedTraceCard
  from '@/features/traces/views/StudentToolsTracesView/components/StudentDetailedTraceCard/StudentDetailedTraceCard.vue'
import StudentToolsTracesViewNotice
  from '@/features/traces/views/StudentToolsTracesView/components/StudentToolsTracesViewNotice/StudentToolsTracesViewNotice.vue'
import TraceFilterContainer from '@/features/traces/views/StudentToolsTracesView/components/TraceFilterContainer/TraceFilterContainer.vue'
import { useI18n } from 'vue-i18n'

defineProps<{
  tracesSummary: TracesSummaryDTO | undefined
}>()

const { t } = useI18n()
const tracesStore = useTracesStore()

const {
  currentPage,
  pageSizeSelected,
  onUpdateCurrentPage,
  onUpdatePageSize,
  resetCurrentPage
} = usePagination(toRef(tracesStore, 'unassociatedCurrentPage'), toRef(tracesStore, 'unassociatedPageSizeSelected'))

const { tracesViewQueryParams, onUpdateFilters } = useTraceFilters({ isAssociated: false })

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
  <div class="av-col av-w-full av-gap-lg">
    <TraceFilterContainer
      :is-associated="false"
      @update:filters="onUpdateFilters"
    />
    <StudentToolsTracesViewNotice :traces-summary="tracesSummary" />
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
