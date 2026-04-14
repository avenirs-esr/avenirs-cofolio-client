<script setup lang="ts">
import { TraceType } from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/types'
import { AvSelect } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const traceType = defineModel<{ itemId: TraceType }>('traceType', {
  default: { itemId: TraceType.FILE },
  type: Object as () => { itemId: TraceType },
})

const { traceTypeOptions } = useTraceTypeSelect()

function useTraceTypeSelect () {
  const traceTypeOptions = computed(() => [
    {
      id: TraceType.FILE,
      label: t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.traceTypeSelect.fileType')
    },
    {
      id: TraceType.LINK,
      label: t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.traceTypeSelect.linkType')
    },
  ])
  return { traceTypeOptions }
}
</script>

<template>
  <div
    class="av-pb-md trace-type-select-container"
    data-testid="trace-type-select"
  >
    <AvSelect
      v-model:selected-item="traceType"
      :label="t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.traceTypeSelect.add')"
      select-id="trace-type-Select"
      placeholder=""
      :options="traceTypeOptions"
      dense
      :aria-label="t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.traceTypeSelect.ariaLabel')"
    />
  </div>
</template>

<style lang="scss" scoped>
.trace-type-select-container {
  border-bottom: 1px solid var(--divider);
}
</style>
