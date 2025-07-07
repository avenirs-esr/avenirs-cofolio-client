<script setup lang="ts">
import { useBaseApiExceptionToast, useNavigation } from '@/common/composables'
import { parseDateISO } from '@/common/utils'
import StudentTraceCard from '@/features/student/components/widgets/StudentTracesWidget/components/StudentTraceCard/StudentTraceCard.vue'
import { useStudentTracesSummaryQuery } from '@/features/student/queries'
import { AvButton, AvCard, AvIconText, MDI_ICONS } from '@/ui'
import { compareDesc } from 'date-fns'
import { useI18n } from 'vue-i18n'

const { data: traces, error } = useStudentTracesSummaryQuery()
useBaseApiExceptionToast(error)
const { navigateToStudentTraces } = useNavigation()
const { t } = useI18n()

const renderedTraces = computed(() => {
  return (traces.value ?? [])
    .slice()
    .sort((a, b) => compareDesc(parseDateISO(a.filedAt), parseDateISO(b.filedAt)))
    .slice(0, 3)
})
</script>

<template>
  <AvCard
    v-if="renderedTraces.length > 0"
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
          v-for="trace in renderedTraces"
          :key="trace.id"
          :trace="trace"
        />
      </div>
    </template>
    <template #footer>
      <div class="traces-widget-container__footer">
        <AvButton
          :label="t('student.widgets.traces.buttons.seeAll')"
          :on-click="navigateToStudentTraces"
          :icon="MDI_ICONS.ARROW_RIGHT_THIN"
          size="sm"
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
