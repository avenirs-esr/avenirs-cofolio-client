<script setup lang="ts">
import { TraceType } from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/types'
import { AvSelect } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const traceType = defineModel<{ itemId: string }>('traceType', {
  default: { itemId: TraceType.FILE },
  type: Object as () => { itemId: string },
})

const { traceTypeOptions } = useTraceTypeSelector()

function useTraceTypeSelector () {
  const traceTypeOptions = computed(() => [
    {
      id: TraceType.FILE,
      label: t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.traceTypeSelector.fileType')
    },
    {
      id: TraceType.LINK,
      label: t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.traceTypeSelector.linkType')
    },
  ])
  return { traceTypeOptions }
}
</script>

<template>
  <div class="trace-type-selector-container">
    <AvSelect
      v-model:selected-item="traceType"
      :label="t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.traceTypeSelector.add')"
      select-id="trace-type-selector"
      placeholder=""
      :options="traceTypeOptions"
      dense
      :aria-label="t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.traceTypeSelector.ariaLabel')"
    />
  </div>
</template>
