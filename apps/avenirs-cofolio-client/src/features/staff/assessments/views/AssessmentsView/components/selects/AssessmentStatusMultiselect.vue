<script setup lang="ts">
import type { AvSelectItem, AvSelectModelValue, AvSelectProps } from '@avenirs-esr/avenirs-dsav'
import { AvSelect } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { EActivityAssessmentStatus } from '@/api/avenir-esr'

const selectedStatuses = defineModel<string[]>({ default: () => [] })
const { t } = useI18n()
const selectedOptions = ref<AvSelectModelValue>(null)

const options = computed<Array<AvSelectItem>>(() => Object.values(EActivityAssessmentStatus).map(status => ({
  label: t(`staff.assessments.views.AssessmentsView.components.selects.AssessmentStatusMultiselect.multiLabels.${status}`),
  value: status
})))

const avSelectProps = computed<AvSelectProps>(() => ({
  label: t('staff.assessments.views.AssessmentsView.components.selects.AssessmentStatusMultiselect.label'),
  placeholder: t('staff.assessments.views.AssessmentsView.components.selects.AssessmentStatusMultiselect.placeholder'),
  options: options.value,
  disabled: !options.value.length,
  labelVisible: true,
  required: true,
  dense: true,
  height: '2.5rem',
  collapseMaxHeight: '35vh',
  multiple: true,
  width: 'var(--dimension-8xl)'
}))

function updateSelectedOptions (event: AvSelectModelValue) {
  selectedOptions.value = event
  selectedStatuses.value = (Array.isArray(event) ? event : [event]).map(option => String(option?.value))
}
</script>

<template>
  <div>
    <AvSelect
      v-bind="avSelectProps"
      :model-value="selectedOptions"
      data-testid="institution-groups-multiselect"
      @update:model-value="updateSelectedOptions"
    />
  </div>
</template>
