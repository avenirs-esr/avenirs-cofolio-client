<script setup lang="ts">
import { type TraceConfigurationInfo, TraceStatus, type TraceViewDTO } from '@/api/avenir-esr'
import AvNotice from '@/ui/base/AvNotice/AvNotice.vue'
import { addDays, isBefore, parseISO } from 'date-fns'
import { useI18n } from 'vue-i18n'

const { traces, tracesConfig } = defineProps<{ traces: TraceViewDTO[], tracesConfig: TraceConfigurationInfo | undefined }>()
const { t } = useI18n()

function analyzeTraces (traces: TraceViewDTO[], daysWarning: number | undefined) {
  const targetDate = daysWarning !== undefined ? addDays(new Date(), daysWarning) : undefined

  const unassociated: TraceViewDTO[] = []
  const toDelete: TraceViewDTO[] = []

  for (const trace of traces) {
    if (trace.status === TraceStatus.UNASSOCIATED) {
      unassociated.push(trace)

      if (targetDate !== undefined && isBefore(parseISO(trace.deletionDate), targetDate)) {
        toDelete.push(trace)
      }
    }
  }
  return { unassociated, toDelete }
}

function createAlertMessage (unassociatedTracesCount: number, tracesToDeleteCount: number, daysWarning: number | undefined, maxDayBeforeDeletion: number | undefined): string {
  let message = t('student.views.studentToolsTracesView.warningMessage.unassociated', unassociatedTracesCount)
  if (tracesToDeleteCount > 0) {
    if (unassociatedTracesCount === 1) {
      message += ` ${t('student.views.studentToolsTracesView.warningMessage.delete.loneTrace')}`
    }
    else {
      message += ` ${t('student.views.studentToolsTracesView.warningMessage.delete.traces', tracesToDeleteCount)}`
    }
    if (daysWarning !== undefined) {
      message += ` ${t('student.views.studentToolsTracesView.warningMessage.delete.days', daysWarning)}`
    }
  }
  if (maxDayBeforeDeletion && maxDayBeforeDeletion > 0) {
    message += ` ${t('student.views.studentToolsTracesView.warningMessage.reminder', maxDayBeforeDeletion)}`
  }
  return message
}

const daysWarning = computed(() => tracesConfig?.maxDayRemainingWarning)
const maxDayBeforeDeletion = computed(() => tracesConfig?.maxDayRemaining)
const traceAnalysis = computed(() => analyzeTraces(traces, daysWarning?.value))
const unassociatedTraces = computed(() => traceAnalysis.value.unassociated)
const tracesToDelete = computed(() => traceAnalysis.value.toDelete)
const unassociatedTracesCount = computed(() => unassociatedTraces.value.length)
const tracesToDeleteCount = computed(() => tracesToDelete.value.length)
</script>

<template>
  <div
    v-if="unassociatedTracesCount > 0"
    class="traces-notice-container"
  >
    <AvNotice
      :text="createAlertMessage(unassociatedTracesCount, tracesToDeleteCount, daysWarning, maxDayBeforeDeletion)"
      type="warning"
    />
  </div>
</template>

<style lang="scss" scoped>
.traces-notice-container {
  padding-bottom: 1.25rem;
}
</style>
