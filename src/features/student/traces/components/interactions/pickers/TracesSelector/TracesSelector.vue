<script setup lang="ts">
import type { TraceOverviewDTO } from '@/api/avenir-esr'
import StudentTraceCard from '@/features/student/traces/components/cards/StudentTraceCard/StudentTraceCard.vue'
import { AvCheckbox } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface TracesSelectorProps {
  traces: TraceOverviewDTO[]
  readonly?: boolean
}

const { traces, readonly = false } = defineProps<TracesSelectorProps>()
const { t } = useI18n()

const selectedTraceIds = defineModel<string[]>({ default: [] })
</script>

<template>
  <div class="traces-selector__container">
    <div
      v-for="trace in traces"
      :key="trace.traceId"
      class="student-trace-card-wrapper"
    >
      <StudentTraceCard :trace="trace" />
      <div
        v-if="!readonly"
        class="student-trace-card-overlay"
        :class="{ 'student-trace-card-overlay--selected': selectedTraceIds.includes(trace.traceId) }"
      >
        <AvCheckbox
          :id="`trace-checkbox-${trace.traceId}`"
          v-model="selectedTraceIds"
          :name="`trace-${trace.traceId}`"
          :value="trace.traceId"
          :aria-label="t('student.traces.tracesSelector.ariaLabel', { title: trace.title })"
          class="student-trace-card-checkbox"
          label=""
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.traces-selector {

  &__container {
    padding: var(--spacing-md);
    border-radius: var(--radius-xl);
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: var(--spacing-md);

    .student-trace-card-wrapper {
      position: relative;
      cursor: pointer;
    }

    .student-trace-card-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--light-background-overlay);
      border-radius: var(--radius-xl);
      display: flex;
      transition: opacity 0.2s ease-in-out;

      :deep(.av-label) {
        justify-content: flex-end;
        padding:  var(--spacing-xs) 0;

        .label {
          display: none;
        }
      }

      &--selected {
        background-color: transparent;
      }
    }
  }
}
</style>
