<script setup lang="ts">
import { useTracesStore } from '@/features/student/traces/stores/traces.store'
import { AvButton, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const tracesStore = useTracesStore()
</script>

<template>
  <div class="av-row av-justify-end av-gap-sm">
    <AvButton
      :label="t('student.traces.views.StudentToolsTracesView.studentToolsTracesActionButtons.addTrace')"
      variant="OUTLINED"
      :icon="MDI_ICONS.PLUS_CIRCLE_OUTLINE"
      small
      @click="tracesStore.displayCreateTraceDrawer"
    />
  </div>
</template>
