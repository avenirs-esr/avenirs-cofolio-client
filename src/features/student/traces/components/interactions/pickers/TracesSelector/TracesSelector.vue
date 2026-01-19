<script setup lang="ts">
import type { TraceOverviewDTO } from '@/api/avenir-esr'
import SelectorOverlay from '@/features/student/global/components/interaction/SelectorOverlay/SelectorOverlay.vue'
import StudentTraceCard from '@/features/student/traces/components/cards/StudentTraceCard/StudentTraceCard.vue'

export interface TracesSelectorProps {
  traces: TraceOverviewDTO[]
  readonly?: boolean
}

const { traces, readonly = false } = defineProps<TracesSelectorProps>()

const selectedTraceIds = defineModel<string[]>({ default: [] })

const selectableTraces = computed(() =>
  traces.map(trace => ({
    label: trace.title,
    value: trace.traceId,
    baseElement: trace
  }))
)
</script>

<template>
  <div class="traces-selector__container av-row av-wrap av-gap-md av-p-md">
    <SelectorOverlay
      v-model:selected-elements="selectedTraceIds"
      :selectable-elements="selectableTraces"
      :readonly="readonly"
    >
      <template #default="{ baseElement }">
        <StudentTraceCard :trace="baseElement as TraceOverviewDTO" />
      </template>
    </SelectorOverlay>
  </div>
</template>

<style scoped lang="scss">
.traces-selector {

  &__container {
    border-radius: var(--radius-xl);

    .student-trace-card-wrapper {
      position: relative;
      cursor: pointer;
    }
  }
}
</style>
