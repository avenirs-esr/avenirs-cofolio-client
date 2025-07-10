<script lang="ts" setup>
import type { PageSizes } from '@/ui/config'
import { Pagination } from '@/common/components'
import { useBaseApiExceptionToast } from '@/common/composables'
import { useUnassignedTracesViewQuery } from '@/features/student/queries'
import StudentDetailedTraceCard from '@/features/student/views/StudentToolsTracesView/components/StudentDetailedTracesCard/StudentDetailedTraceCard.vue'
import StudentToolsTracesViewNotice from '@/features/student/views/StudentToolsTracesView/components/StudentToolsTracesViewNotice/StudentToolsTracesViewNotice.vue'
import { useTracesStore } from '@/store'

const tracesStore = useTracesStore()
const currentPage = toRef(tracesStore, 'currentPage')
const pageSizeSelected = toRef(tracesStore, 'pageSizeSelected')
const { traces, pageInfo, error } = useUnassignedTracesViewQuery(currentPage, pageSizeSelected)
useBaseApiExceptionToast(error)

function onUpdateCurrentPage (pageNumber: number) {
  currentPage.value = pageNumber
}

function onUpdatePageSize (pageSize: PageSizes) {
  tracesStore.pageSizeSelected = pageSize
}

watch(pageSizeSelected, () => {
  currentPage.value = 0
}, { immediate: true })
</script>

<template>
  <div class="student-tools-traces-view-container">
    <StudentToolsTracesViewNotice />
    <Pagination
      :page-info="pageInfo"
      :page-size-selected="tracesStore.pageSizeSelected"
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

<style lang="scss" scoped>
.student-tools-traces-view-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 2rem;
}

.detailed-cards-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  gap: 1rem;
  flex-wrap: wrap;
}
</style>
