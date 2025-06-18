<script lang="ts" setup>
import type { TraceViewDTO } from '@/api/avenir-esr'
import { TracePaginationSizePicker } from '@/common/components'
import StudentDetailedTraceCard from '../StudentDetailedTracesCard/StudentDetailedTraceCard.vue'

const { traces } = defineProps<{ traces: TraceViewDTO[] }>()
</script>

<template>
  <div class="student-tools-traces-view-container">
    <div class="top-pagination-container">
      <TracePaginationSizePicker />
    </div>
    <div class="detailed-cards-container">
      <StudentDetailedTraceCard
        v-for="trace in traces"
        :key="trace.id"
        :trace="trace"
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
  gap: 1.75rem;
  flex-wrap: wrap;
}
</style>
