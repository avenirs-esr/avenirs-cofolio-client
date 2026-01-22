<script setup lang="ts">
import { useBaseApiExceptionToast, useNavigation } from '@/common/composables'
import StudentTraceCard from '@/features/student/traces/components/cards/StudentTraceCard/StudentTraceCard.vue'
import { useStudentTracesSummaryQuery } from '@/features/student/traces/queries/use-traces.query/use-traces.query'
import { AvButton, AvCard, AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { data: traces, error } = useStudentTracesSummaryQuery()
useBaseApiExceptionToast(error)
const { navigateToStudentTraces } = useNavigation()
const { t } = useI18n()

// TODO DRY: create HomeSideWidget and HomeMainWidget #998
</script>

<template>
  <AvCard
    background-color="var(--other-background-base)"
    title-background="var(--other-background-base)"
  >
    <template #title>
      <div class="av-pl-sm">
        <AvIconText
          :icon="MDI_ICONS.ATTACH_FILE"
          :text="t('student.traces.cards.StudentTracesWidget.title')"
          icon-color="var(--icon)"
          text-color="var(--title)"
          typography-class="n5"
          gap="var(--spacing-xs)"
        />
      </div>
    </template>
    <template #body>
      <div class="av-row av-wrap av-gap-md">
        <StudentTraceCard
          v-for="trace in traces"
          :key="trace.traceId"
          :trace="trace"
        />
      </div>
    </template>
    <template #footer>
      <div class="av-row av-justify-end av-pt-sm">
        <AvButton
          :label="t('student.traces.cards.StudentTracesWidget.buttons.seeAll')"
          :icon="MDI_ICONS.ARROW_RIGHT_THIN"
          small
          @click="navigateToStudentTraces"
        />
      </div>
    </template>
  </AvCard>
</template>
