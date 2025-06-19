<script lang="ts" setup>
import { TracePaginationSizePicker } from '@/common/components'
import { useBaseApiExceptionToast, usePaginationPages } from '@/common/composables'
import { useTracesViewQuery } from '@/features/student/queries'
import { useTracePagination, useTracePaginationSizePicker } from '@/store'
import { AvPagination } from '@/ui'
import StudentDetailedTraceCard from '../StudentDetailedTracesCard/StudentDetailedTraceCard.vue'

const paginationSizeStore = useTracePaginationSizePicker()
const tracePaginationStore = useTracePagination()

const currentPage = computed(() => tracePaginationStore.currentPage)
const paginationSize = computed(() => paginationSizeStore.paginationSize)
const query = useTracesViewQuery(currentPage, paginationSize)
useBaseApiExceptionToast(query.error)

const traces = computed(() => query.data.value?.data.traces ?? [])
const pageInfo = computed(() => query.data.value?.page ?? { number: 0, size: 0, totalElements: 0, totalPages: 0 })

const pages = computed(() => usePaginationPages(pageInfo.value.totalPages))

function onUpdateCurrentPage (payload: number) {
  tracePaginationStore.currentPage = payload
}

watch(paginationSize, () => {
  tracePaginationStore.currentPage = 0
})
</script>

<template>
  <div class="student-tools-traces-view-container">
    <div class="top-pagination-container">
      <TracePaginationSizePicker />
      <AvPagination
        :current-page="pageInfo.number"
        :pages="pages"
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
        :items="traces"
        :current-page="pageInfo.number"
        :pages="pages"
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
