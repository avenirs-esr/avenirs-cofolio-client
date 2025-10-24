<script setup lang="ts">
import type { TraceOverviewDTO } from '@/api/avenir-esr'
import StudentTraceCard from '@/features/student/components/widgets/StudentTracesWidget/components/StudentTraceCard/StudentTraceCard.vue'
import { useI18n } from 'vue-i18n'

const { traceAssociations } = defineProps<{ traceAssociations: TraceOverviewDTO[] }>()
const { t } = useI18n()
</script>

<template>
  <div class="student-additional-skill-associations-container">
    <span class="associated-trace-count">{{ t('student.views.studentAdditionalSkillView.tabs.associations.associatedTracesLabel', traceAssociations.length) }}</span>
    <div class="student-trace-card-container">
      <StudentTraceCard
        v-for="trace in traceAssociations"
        :key="trace.traceId"
        :trace="trace"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.student-trace-card-container {
  background-color: var(--surface-background);
  padding: 1.5rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1.25rem;
  border-radius: 1.5rem;
}

.associated-trace-count {
  color: var(--text2);
}
</style>
