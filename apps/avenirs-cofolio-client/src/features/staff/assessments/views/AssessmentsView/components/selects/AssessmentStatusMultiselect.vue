<script setup lang="ts">
import type { AvSelectItem, AvSelectProps, AvSelectSelectedOption } from '@avenirs-esr/avenirs-dsav'
import { AvSelect } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { EActivityAssessmentStatus } from '@/api/avenir-esr'

const selectedStatuses = defineModel<EActivityAssessmentStatus[]>({ default: () => [] })
const selectedStatusesRef = ref<AvSelectSelectedOption[]>([])
const { t } = useI18n()

const statusesOptions = computed<Array<AvSelectItem>>(() => Object.values(EActivityAssessmentStatus).map(status => ({
  label: t(`staff.assessments.views.AssessmentsView.components.selects.AssessmentStatusMultiselect.multiLabels.${status}`),
  value: status
})))

const avSelectProps = computed<AvSelectProps>(() => ({
  label: t('staff.assessments.views.AssessmentsView.components.selects.AssessmentStatusMultiselect.label'),
  placeholder: t('staff.assessments.views.AssessmentsView.components.selects.AssessmentStatusMultiselect.placeholder'),
  options: statusesOptions.value,
  disabled: !statusesOptions.value.length,
  labelVisible: true,
  required: true,
  dense: true,
  height: '2.5rem',
  collapseMaxHeight: '35vh',
  multiple: true,
  width: 'var(--dimension-8xl)'
}))

watch(selectedStatusesRef, (newVal) => {
  const selectedOptions = Array.isArray(newVal) ? newVal : [newVal]

  selectedStatuses.value = selectedOptions.map(option => option.value as EActivityAssessmentStatus)
}, { immediate: true })
</script>

<template>
  <div>
    <AvSelect
      v-model="selectedStatusesRef"
      v-bind="avSelectProps"
      :options="statusesOptions"
      data-testid="institution-groups-multiselect"
    />
  </div>
</template>
