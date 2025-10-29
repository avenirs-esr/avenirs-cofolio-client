<script setup lang="ts">
import type { TraceOverviewDTO } from '@/api/avenir-esr'
import { TracesSelector } from '@/features/student/components/traces'
import { useI18n } from 'vue-i18n'

const { traceAssociations } = defineProps<{ traceAssociations: TraceOverviewDTO[] }>()
const { t } = useI18n()
</script>

<template>
  <div class="student-additional-skill-associations-container">
    <span class="b2-regular associated-trace-count">{{ t('student.views.studentAdditionalSkillView.tabs.associations.associatedTracesLabel', traceAssociations.length) }}</span>
    <TracesSelector
      :traces="traceAssociations"
      readonly
    />
  </div>
</template>

<style scoped lang="scss">
.associated-trace-count {
  color: var(--text2);
}
</style>
