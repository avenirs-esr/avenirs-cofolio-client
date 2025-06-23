<script setup lang="ts">
import type { TraceConfigurationInfo } from '@/api/avenir-esr'
import type { UnassignedTracesSummaryDTO } from '@/types'
import AvNotice from '@/ui/base/AvNotice/AvNotice.vue'
import { useI18n } from 'vue-i18n'

const { unassignedTracesSummary, tracesConfig } = defineProps<{ unassignedTracesSummary: UnassignedTracesSummaryDTO | undefined, tracesConfig: TraceConfigurationInfo | undefined }>()
const { t } = useI18n()

function createAlertMessage (unassociatedTracesCount: number, tracesToDeleteCount: number, criticalDays: number | undefined, maxDayBeforeDeletion: number | undefined): string {
  let message = t('student.views.studentToolsTracesView.warningMessage.unassociated', unassociatedTracesCount)
  if (tracesToDeleteCount > 0) {
    if (unassociatedTracesCount === 1) {
      message += ` ${t('student.views.studentToolsTracesView.warningMessage.delete.loneTrace')}`
    }
    else {
      message += ` ${t('student.views.studentToolsTracesView.warningMessage.delete.traces', tracesToDeleteCount)}`
    }
    if (criticalDays !== undefined) {
      message += ` ${t('student.views.studentToolsTracesView.warningMessage.delete.days', criticalDays)}`
    }
  }
  if (maxDayBeforeDeletion && maxDayBeforeDeletion > 0) {
    message += ` ${t('student.views.studentToolsTracesView.warningMessage.reminder', maxDayBeforeDeletion)}`
  }
  return message
}

const criticalDays = computed(() => tracesConfig?.maxDayRemainingCritical)
const maxDayBeforeDeletion = computed(() => tracesConfig?.maxDayRemaining)
</script>

<template>
  <div
    v-if="unassignedTracesSummary && unassignedTracesSummary.total > 0"
    class="traces-notice-container"
  >
    <AvNotice
      :text="createAlertMessage(unassignedTracesSummary.total, unassignedTracesSummary.totalCriticals, criticalDays, maxDayBeforeDeletion)"
      type="warning"
    />
  </div>
</template>

<style lang="scss" scoped>
.traces-notice-container {
  padding-bottom: 1.25rem;
}
</style>
