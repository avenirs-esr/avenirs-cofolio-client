<script setup lang="ts">
import { useTracesStore } from '@/features/student/traces/stores/traces.store'
import { AvButton, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const tracesStore = useTracesStore()
</script>

<template>
  <div class="student-tools-trace-action-buttons">
    <AvButton
      :label="t('student.views.studentToolsTracesView.studentToolsTracesActionButtons.addTrace')"
      variant="OUTLINED"
      :icon="MDI_ICONS.PLUS_CIRCLE_OUTLINE"
      small
      @click="tracesStore.displayCreateTraceDrawer"
    />
  </div>
</template>

<style scoped lang="scss">
.student-tools-trace-action-buttons {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  padding: 0 var(--spacing-sm);
  gap: var(--spacing-sm);
}
</style>
