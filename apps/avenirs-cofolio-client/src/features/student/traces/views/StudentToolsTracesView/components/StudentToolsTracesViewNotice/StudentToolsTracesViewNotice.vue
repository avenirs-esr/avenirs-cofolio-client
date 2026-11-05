<script setup lang="ts">
import type { TracesSummaryDTO } from '@/api/avenir-esr'
import { AvNotice, formatTextToHtml } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { useGetTraceConfig } from '@/api/avenir-esr'

defineProps<{
  tracesSummary: TracesSummaryDTO | undefined
}>()

const { t } = useI18n()

const { data: tracesConfig } = useGetTraceConfig()

function createAlertMessage (unassociatedTracesCount: number, tracesToDeleteCount: number, criticalDays: number | undefined, maxDayBeforeDeletion: number | undefined): string {
  let message = t('student.traces.views.StudentToolsTracesView.warningMessage.unassociated', unassociatedTracesCount)
  if (tracesToDeleteCount > 0) {
    if (unassociatedTracesCount === 1) {
      message += ` ${t('student.traces.views.StudentToolsTracesView.warningMessage.delete.loneTrace')}`
    }
    else {
      message += ` ${t('student.traces.views.StudentToolsTracesView.warningMessage.delete.traces', tracesToDeleteCount)}`
    }
    if (criticalDays !== undefined) {
      message += ` ${t('student.traces.views.StudentToolsTracesView.warningMessage.delete.days', criticalDays)}`
    }
  }
  if (maxDayBeforeDeletion && maxDayBeforeDeletion > 0) {
    message += ` ${t('student.traces.views.StudentToolsTracesView.warningMessage.reminder', maxDayBeforeDeletion)}`
  }
  return formatTextToHtml(message)
}

const criticalDays = computed(() => tracesConfig.value?.maxRemainingDaysBeforeCritical)
const maxDayBeforeDeletion = computed(() => tracesConfig.value?.maxRemainingDays)
</script>

<template>
  <div
    v-if="tracesSummary && tracesSummary.unassociated > 0"
    class="student-tools-traces-view-notice av-pb-sm"
  >
    <AvNotice
      :text="createAlertMessage(tracesSummary.unassociated, tracesSummary.totalCriticals, criticalDays, maxDayBeforeDeletion)"
      type="warning"
    />
  </div>
</template>
