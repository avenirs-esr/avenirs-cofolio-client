<script setup lang="ts">
import { useGetTraceOverview } from '@/api/avenir-esr'
import HomeWidget from '@/common/components/cards/HomeWidget/HomeWidget.vue'
import QuerySuspense from '@/common/components/QuerySuspense/QuerySuspense.vue'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { ROUTES } from '@/common/constants'
import TraceLongIconCard from '@/features/student/global/views/StudentHomeView/components/TraceLongIconCard/TraceLongIconCard.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { data: apiTraces, error, isLoading } = useGetTraceOverview()
const { t } = useI18n()
const { getErrorMessage } = useApiErrors()

const traces = computed(() => apiTraces.value ?? [])
</script>

<template>
  <HomeWidget
    :title="t('student.traces.cards.TracesWidget.title')"
    :title-icon="MDI_ICONS.ATTACH_FILE"
    :see-all-label="t('student.traces.cards.TracesWidget.buttons.seeAll')"
    type="main"
    :to="ROUTES.STUDENT.TOOLS_TRACES"
    data-testid="student-traces-widget"
  >
    <QuerySuspense
      :is-loading="isLoading"
      :is-empty="traces.length === 0"
      :error="error"
      :error-title="t('student.traces.cards.TracesWidget.error')"
      :error-description="getErrorMessage(error)"
      :empty-state-message="t('student.traces.cards.TracesWidget.emptyState')"
    >
      <div class="av-col av-gap-md">
        <TraceLongIconCard
          v-for="trace in traces"
          :key="trace.id"
          :trace="trace"
        />
      </div>
    </QuerySuspense>
  </HomeWidget>
</template>
