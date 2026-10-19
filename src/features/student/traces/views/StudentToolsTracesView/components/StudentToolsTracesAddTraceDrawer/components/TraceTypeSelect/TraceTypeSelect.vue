<script setup lang="ts">
import type { AvSelectOption } from '@avenirs-esr/avenirs-dsav'
import { AvSelect } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { TraceType } from '@/features/student/traces/types/traces.types'

const { t } = useI18n()

const traceType = defineModel<{ itemId: TraceType }>('traceType', {
  default: () => ({ itemId: TraceType.FILE }),
  type: Object as () => { itemId: TraceType },
})

const traceTypeOptions = computed<AvSelectOption[]>(() => [
  {
    value: TraceType.FILE,
    label: t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.traceTypeSelect.fileType')
  },
  {
    value: TraceType.LINK,
    label: t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.traceTypeSelect.linkType')
  },
])

const selectedTraceType = computed<AvSelectOption>({
  get () {
    return traceTypeOptions.value.find(
      option => option.value === traceType.value.itemId,
    ) ?? traceTypeOptions.value[0]
  },
  set (option) {
    traceType.value = { itemId: option.value as TraceType }
  },
})
</script>

<template>
  <div
    class="av-pb-md av-separator-bottom trace-type-select av-w-full"
    data-testid="trace-type-select"
  >
    <AvSelect
      v-model="selectedTraceType"
      :label="t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.traceTypeSelect.add')"
      :selected-text="selectedTraceType.label"
      select-id="trace-type-select"
      placeholder=""
      :options="traceTypeOptions"
      dense
      width="100%"
      required
      :aria-label="t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.traceTypeSelect.ariaLabel')"
    />
  </div>
</template>
