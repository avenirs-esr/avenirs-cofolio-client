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
  <div class="av-row av-wrap av-gap-md av-py-md av-px-md--md">
    <SelectorOverlay
      v-model:selected-elements="selectedTraceIds"
      :selectable-elements="selectableTraces"
      :readonly="readonly"
    >
      <template #default="{ baseElement }">
        <StudentTraceCard :trace="(baseElement as TraceOverviewDTO)" />
      </template>
    </SelectorOverlay>
  </div>
</template>
