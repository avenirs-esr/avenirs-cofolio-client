<script setup lang="ts">
import { useGetTraceOverview } from '@/api/avenir-esr'
import { useBaseApiExceptionToast } from '@/common/composables'
import { ROUTES } from '@/common/constants'
import HomeWidget from '@/features/student/global/views/StudentHomeView/components/HomeWidget/HomeWidget.vue'
import StudentTraceCard from '@/features/student/traces/components/cards/StudentTraceCard/StudentTraceCard.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { data: apiTraces, error } = useGetTraceOverview()
useBaseApiExceptionToast(error)
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
    :to="ROUTES.STUDENT.TOOLS_TRACES"
    data-testid="student-traces-widget"
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
