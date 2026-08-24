<script setup lang="ts">
import type { ActivityDraftUpdateRequest } from '@/api/avenir-esr'
import type { EditActivityForm } from '@/features/staff/activities/types/forms.types'
import ToggleParameterCard from '@/features/staff/global/components/cards/ToggleParameterCard/ToggleParameterCard.vue'
import { AvPeriodInput, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface ActivityExecutionPeriodFormFieldProps {
  form: EditActivityForm
}

defineOptions({ inheritAttrs: false })

const { form } = defineProps<ActivityExecutionPeriodFormFieldProps>()

const emit = defineEmits<{
  autosave: [value: Partial<ActivityDraftUpdateRequest>]
  updateExecutionPeriodEnabled: [value: boolean]
}>()

const { t } = useI18n()

const startDateField = form.useField({ name: 'startDate' })
const endDateField = form.useField({ name: 'endDate' })

const startDate = computed(() => startDateField.state.value.value || undefined)
const endDate = computed(() => endDateField.state.value.value || undefined)

const toggleOverride = ref(false)

const inputEnabled = computed({
  get: () => !!startDate.value || !!endDate.value || toggleOverride.value,
  set: (newValue: boolean) => {
    toggleOverride.value = newValue
    emit('updateExecutionPeriodEnabled', newValue)
    if (!newValue) {
      startDateField.api.handleChange(undefined)
      endDateField.api.handleChange(undefined)
      emit('autosave', { startDate: undefined, endDate: undefined })
    }
    else {
      form.validateField('startDate', 'submit')
      form.validateField('endDate', 'submit')
    }
  },
})

function autosaveIfConsistent (start: string | undefined, end: string | undefined) {
  if ((start && end) || (!start && !end)) {
    emit('autosave', { startDate: start, endDate: end })
  }
}

function setStartDate (value: string) {
  startDateField.api.handleChange(value)
  autosaveIfConsistent(value || undefined, endDate.value)
}

function setEndDate (value: string) {
  endDateField.api.handleChange(value)
  autosaveIfConsistent(startDate.value, value || undefined)
}
</script>

<template>
  <ToggleParameterCard
    v-model="inputEnabled"
    data-testid="execution-period-parameter-toggle"
    :title="t('staff.activities.views.EditNationalActivityView.ActivityExecutionPeriodFormField.title')"
    :icon="MDI_ICONS.CALENDAR_MONTH_OUTLINE"
  >
    <AvPeriodInput
      v-if="inputEnabled"
      data-testid="activity-execution-period-input"
      :label="t('staff.activities.views.EditNationalActivityView.ActivityExecutionPeriodFormField.periodLabel')"
      :label-visible="false"
      :start-model-value="startDate ?? ''"
      :end-model-value="endDate ?? ''"
      :start-error-message="startDateField.state.value.meta.errors?.join(', ')"
      :end-error-message="endDateField.state.value.meta.errors?.join(', ')"
      @update:start-model-value="setStartDate"
      @update:end-model-value="setEndDate"
    />
  </ToggleParameterCard>
</template>
