<script setup lang="ts">
import type { TraceOverviewDTO } from '@/api/avenir-esr'
import { TracesSelector } from '@/features/student/traces'
import { useI18n } from 'vue-i18n'

const { traceAssociations } = defineProps<{ traceAssociations: TraceOverviewDTO[] }>()
const { t } = useI18n()
</script>

<template>
  <div class="student-declared-skill-associations-container">
    <span class="b2-regular associated-trace-count">{{ t('student.global.myAssociatedTracesWithCount', { count: traceAssociations.length }) }}</span>
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
