<script setup lang="ts">
import type { AssociateElementTypeConfig } from '@/features/student/traces/types/traces.types'
import { AvSelect } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { typeConfigs } = defineProps<{ typeConfigs: AssociateElementTypeConfig[] }>()

const activeTypeKey = defineModel<string>('activeTypeKey', { required: true })

const { t } = useI18n()

const selectedTypeItem = computed({
  get: () => ({ itemId: activeTypeKey.value }),
  set: (val: { itemId: string }) => {
    activeTypeKey.value = val.itemId
  }
})

const typeSelectOptions = computed(() =>
  typeConfigs.map(config => ({
    id: config.key,
    label: config.label
  }))
)
</script>

<template>
  <AvSelect
    v-model:selected-item="selectedTypeItem"
    :options="typeSelectOptions"
    :label="t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.associateElements.typeSelectLabel')"
    :placeholder="t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.associateElements.typeSelectPlaceholder')"
    data-testid="associate-elements-type-select"
  />
</template>
