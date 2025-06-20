<script lang="ts" setup>
import { TracePageSizePicker } from '@/common/components'
import { useBaseApiExceptionToast, usePaginationPages } from '@/common/composables'
import { useTracesViewQuery } from '@/features/student/queries'
import { useTracePageSizePicker, useTracePagination } from '@/store'
import { AvPagination } from '@/ui'
import { useI18n } from 'vue-i18n'
import StudentDetailedTraceCard from '../StudentDetailedTracesCard/StudentDetailedTraceCard.vue'

const { t } = useI18n()
const pageSizeStore = useTracePageSizePicker()
const tracePaginationStore = useTracePagination()

const currentPage = computed(() => tracePaginationStore.currentPage)
const pageSize = computed(() => pageSizeStore.pageSize)
const query = useTracesViewQuery(currentPage, pageSize)
useBaseApiExceptionToast(query.error)

const traces = computed(() => query.data.value?.data.traces ?? [])
const pageInfo = computed(() => query.data.value?.page ?? { number: 0, size: 0, totalElements: 0, totalPages: 0 })
const totalPages = computed(() => pageInfo.value.totalPages)

const pages = computed(() => usePaginationPages(totalPages))

function onUpdateCurrentPage (payload: number) {
  tracePaginationStore.currentPage = payload
}

watch(pageSize, () => {
  tracePaginationStore.currentPage = 0
})
</script>

<template>
  <div class="student-tools-traces-view-container">
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
