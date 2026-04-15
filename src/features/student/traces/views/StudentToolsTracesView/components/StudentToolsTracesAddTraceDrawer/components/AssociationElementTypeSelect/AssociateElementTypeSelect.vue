<script setup lang="ts">
import type { AssociateElementTypeConfig } from '@/features/student/traces/types/traces.types'
import { AvSelect } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { typeConfigs } = defineProps<{ typeConfigs: AssociateElementTypeConfig[] }>()

const emit = defineEmits<{
  (e: 'typeChange', typeKey: string): void
}>()

const { t } = useI18n()

const selectedTypeItem = ref<{ itemId: string }>({
  itemId: typeConfigs[0]?.key ?? ''
})

const typeSelectOptions = computed(() =>
  typeConfigs.map(config => ({
    id: config.key,
    label: config.label
  }))
)

watch(selectedTypeItem, (val) => {
  emit('typeChange', val.itemId)
})
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
