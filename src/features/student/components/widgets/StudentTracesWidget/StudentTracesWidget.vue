<script setup lang="ts">
import { useBaseApiExceptionToast, useNavigation } from '@/common/composables'
import { StudentTraceCard } from '@/features/student/components/cards'
import { useStudentTracesSummaryQuery } from '@/features/student/queries'
import { AvButton, AvCard, AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { data: traces, error } = useStudentTracesSummaryQuery()
useBaseApiExceptionToast(error)
const { navigateToStudentTraces } = useNavigation()
const { t } = useI18n()
</script>

<template>
  <AvCard
    background-color="var(--other-background-base)"
    title-background="var(--other-background-base)"
  >
    <template #title>
      <div class="traces-widget-container__title">
        <AvIconText
          :icon="MDI_ICONS.ATTACH_FILE"
          :text="t('student.widgets.traces.title')"
          icon-color="var(--icon)"
          text-color="var(--title)"
          typography-class="n5"
          gap="0.75rem"
        />
      </div>
    </template>
    <template #body>
      <div class="traces-widget-container__body">
        <StudentTraceCard
          v-for="trace in traces"
          :key="trace.traceId"
          :trace="trace"
        />
      </div>
    </template>
    <template #footer>
      <div class="traces-widget-container__footer">
        <AvButton
          :label="t('student.widgets.traces.buttons.seeAll')"
          :icon="MDI_ICONS.ARROW_RIGHT_THIN"
          size="sm"
          @click="navigateToStudentTraces"
        />
      </div>
    </template>
  </AvCard>
</template>

<style lang="scss" scoped>
.traces-widget-container__title {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  padding-left: 0.75rem;
}

.traces-widget-container__body {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1.25rem;
}

.traces-widget-container__footer {
  display: flex;
  flex-direction: row-reverse;
  padding-top: 1.25rem;
}
</style>
