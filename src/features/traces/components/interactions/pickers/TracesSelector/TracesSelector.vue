<script setup lang="ts">
import type { TraceOverviewDTO, TraceViewDTO } from '@/api/avenir-esr'
import SelectorOverlay from '@/common/components/overlay/SelectorOverlay/SelectorOverlay.vue'
import StudentTraceCard from '@/features/traces/components/cards/StudentTraceCard/StudentTraceCard.vue'
import StudentTraceViewCompactCard
  from '@/features/traces/views/StudentToolsTracesView/components/StudentTraceViewCompactCard/StudentTraceViewCompactCard.vue'

type SelectableTrace = TraceOverviewDTO | TraceViewDTO

export interface TracesSelectorProps {
  traces: SelectableTrace[]
  readonly?: boolean
  compact?: boolean
}

const { traces, readonly = false, compact = false } = defineProps<TracesSelectorProps>()

const selectedTraceIds = defineModel<string[]>({ default: [] })

function isTraceOverviewDTO (trace: SelectableTrace): trace is TraceOverviewDTO {
  return !('isAssociated' in trace)
}

const selectableTraces = computed(() =>
  traces.map(trace => ({
    label: trace.title,
    value: trace.id,
    baseElement: trace,
  }))
)
</script>

<template>
  <div
    class="av-row av-wrap av-gap-md av-justify-center traces-selector-wrapper"
  >
    <SelectorOverlay
      v-model:selected-elements="selectedTraceIds"
      class="traces-selector"
      :selectable-elements="selectableTraces"
      :readonly="readonly"
      :compact="compact"
      border-radius="var(--radius-lg)"
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
.traces-selector-wrapper {
  width: fit-content;
  max-width: 100%;
}
</style>
