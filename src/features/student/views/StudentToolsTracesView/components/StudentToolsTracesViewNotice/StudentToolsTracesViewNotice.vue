<script setup lang="ts">
import { useStudentTracesConfigurationQuery, useUnassignedTracesSummaryQuery } from '@/features/student/queries'
import AvNotice from '@/ui/base/AvNotice/AvNotice.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { data: unassignedTracesSummary } = useUnassignedTracesSummaryQuery()
const { data: tracesConfig } = useStudentTracesConfigurationQuery()

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

const criticalDays = computed(() => tracesConfig.value?.maxDayRemainingCritical)
const maxDayBeforeDeletion = computed(() => tracesConfig.value?.maxDayRemaining)
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
