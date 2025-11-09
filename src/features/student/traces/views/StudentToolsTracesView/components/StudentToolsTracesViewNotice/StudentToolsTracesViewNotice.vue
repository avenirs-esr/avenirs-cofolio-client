<script setup lang="ts">
import type { TracesSummaryDTO } from '@/api/avenir-esr'
import { useTracesConfigurationQuery } from '@/features/student/queries'
import { AvNotice } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

defineProps<{
  tracesSummary: TracesSummaryDTO | undefined
}>()

const { t } = useI18n()

const { data: tracesConfig } = useTracesConfigurationQuery()

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

const criticalDays = computed(() => tracesConfig.value?.maxRemainingDaysBeforeCritical)
const maxDayBeforeDeletion = computed(() => tracesConfig.value?.maxRemainingDays)
</script>

<template>
  <div
    v-if="tracesSummary && tracesSummary.unassociated > 0"
    class="traces-notice-container"
  >
    <AvNotice
      :text="createAlertMessage(tracesSummary.unassociated, tracesSummary.totalCriticals, criticalDays, maxDayBeforeDeletion)"
      type="warning"
    />
  </div>
</template>

<style lang="scss" scoped>
.traces-notice-container {
  padding-bottom: 1.25rem;
}
</style>
