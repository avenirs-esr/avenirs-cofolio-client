<script setup lang="ts">
import type { TraceOverviewDTO, TraceViewDTO } from '@/api/avenir-esr'
import SelectorOverlay from '@/features/student/global/components/interaction/SelectorOverlay/SelectorOverlay.vue'
import StudentTraceCard from '@/features/student/traces/components/cards/StudentTraceCard/StudentTraceCard.vue'
import StudentTraceViewCompactCard
  from '@/features/student/traces/views/StudentToolsTracesView/components/StudentTraceViewCompactCard/StudentTraceViewCompactCard.vue'

type SelectableTrace = TraceOverviewDTO | TraceViewDTO

export interface TracesSelectorProps {
  traces: SelectableTrace[]
  readonly?: boolean
  compact?: boolean
}

const { traces, readonly = false, compact = false } = defineProps<TracesSelectorProps>()

const selectedTraceIds = defineModel<string[]>({ default: [] })

function isTraceOverviewDTO (trace: SelectableTrace): trace is TraceOverviewDTO {
  return 'programName' in trace && 'authorType' in trace
}

const selectableTraces = computed(() =>
  traces.map(trace => ({
    label: trace.title,
    value: trace.id,
    baseElement: trace,
    disabled: !isTraceOverviewDTO(trace) && !trace.isDeletable
  }))
)
</script>

<template>
  <div
    class="av-row av-wrap av-gap-md av-py-md av-px-md--md"
    :class="{ 'traces-selector--compact': compact }"
  >
    <SelectorOverlay
      v-model:selected-elements="selectedTraceIds"
      class="traces-selector"
      :selectable-elements="selectableTraces"
      :readonly="readonly"
    >
      <template #default="{ baseElement }">
        <StudentTraceCard
          v-if="isTraceOverviewDTO(baseElement as SelectableTrace)"
          :trace="(baseElement as TraceOverviewDTO)"
        />

        <StudentTraceViewCompactCard
          v-else
          :trace="(baseElement as TraceViewDTO)"
        />
      </template>
    </SelectorOverlay>
  </div>
</template>

<style lang="scss" scoped>
.traces-selector--compact {
  :deep(.selector-overlay__checkbox > .av-icon) {
    transform: translateY(0.75rem);
  }
}
</style>
