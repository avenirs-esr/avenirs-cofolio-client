<script setup lang="ts">
import { useBaseApiExceptionToast, useNavigation } from '@/common/composables'
import HomeWidget from '@/features/student/global/views/StudentHomeView/components/HomeWidget/HomeWidget.vue'
import StudentTraceCard from '@/features/student/traces/components/cards/StudentTraceCard/StudentTraceCard.vue'
import { useStudentTracesSummaryQuery } from '@/features/student/traces/queries/use-traces.query/use-traces.query'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { data: apiTraces, error } = useStudentTracesSummaryQuery()
useBaseApiExceptionToast(error)
const { navigateToStudentTraces } = useNavigation()
const { t } = useI18n()

const traces = computed(() => apiTraces.value ?? [])
</script>

<template>
  <HomeWidget
    :title="t('student.traces.cards.StudentTracesWidget.title')"
    :title-icon="MDI_ICONS.ATTACH_FILE"
    :see-all-label="t('student.traces.cards.StudentTracesWidget.buttons.seeAll')"
    :display-widget="traces.length > 0"
    type="main"
    data-testid="student-traces-widget"
    @see-all-click="navigateToStudentTraces"
  >
    <div class="av-row av-wrap av-gap-md">
      <StudentTraceCard
        v-for="trace in traces"
        :key="trace.id"
        :trace="trace"
      />
    </div>
  </HomeWidget>
</template>
