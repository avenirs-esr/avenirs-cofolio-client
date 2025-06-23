<script lang="ts" setup>
import { TracePageSizePicker } from '@/common/components'
import { useBaseApiExceptionToast } from '@/common/composables'
import { useStudentTracesConfigurationQuery, useUnassignedTracesSummaryQuery, useUnassignedTracesViewQuery } from '@/features/student/queries'
import { useTracesStore } from '@/store'
import { AvPagination, getPaginationPages } from '@/ui'
import { useI18n } from 'vue-i18n'
import StudentDetailedTraceCard from '../StudentDetailedTracesCard/StudentDetailedTraceCard.vue'
import StudentToolsTracesViewNotice from '../StudentToolsTracesViewNotice/StudentToolsTracesViewNotice.vue'

const { t } = useI18n()
const tracesStore = useTracesStore()
const currentPage = toRef(tracesStore, 'currentPage')
const pageSizeSelected = toRef(tracesStore, 'pageSizeSelected')
const { traces, pageInfo, error } = useUnassignedTracesViewQuery(currentPage, pageSizeSelected)
useBaseApiExceptionToast(error)

const { data: unassignedTracesSummary } = useUnassignedTracesSummaryQuery()
const { data: tracesConfig } = useStudentTracesConfigurationQuery()
const totalPages = computed(() => pageInfo.value.totalPages)
const pages = computed(() => getPaginationPages(totalPages))

function onUpdateCurrentPage (pageNumber: number) {
  currentPage.value = pageNumber
}

watch(pageSizeSelected, () => {
  currentPage.value = 0
}, { immediate: true })
</script>

<template>
  <div class="student-tools-traces-view-container">
    <StudentToolsTracesViewNotice
      :unassigned-traces-summary="unassignedTracesSummary"
      :traces-config="tracesConfig"
    />
    <div class="top-pagination-container">
      <TracePageSizePicker />
      <AvPagination
        id="top-pagination"
        :current-page="pageInfo.number"
        :pages="pages"
        :aria-label="t('student.views.studentToolsTracesView.studentToolsTracesViewContainer.pagination.top.ariaLabel')"
        compact
        @update:current-page="onUpdateCurrentPage"
      />
    </div>
    <div class="detailed-cards-container">
      <StudentDetailedTraceCard
        v-for="trace in traces"
        :key="trace.id"
        :trace="trace"
      />
    </div>
    <div class="bottom-pagination-container">
      <AvPagination
        id="bottom-pagination"
        :items="traces"
        :current-page="pageInfo.number"
        :pages="pages"
        :aria-label="t('student.views.studentToolsTracesView.studentToolsTracesViewContainer.pagination.bottom.ariaLabel')"
        @update:current-page="onUpdateCurrentPage"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.student-tools-traces-view-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 2rem;
}

.top-pagination-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.detailed-cards-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  gap: 1rem;
  flex-wrap: wrap;
}

.bottom-pagination-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  padding-bottom: 2rem;
}
</style>
