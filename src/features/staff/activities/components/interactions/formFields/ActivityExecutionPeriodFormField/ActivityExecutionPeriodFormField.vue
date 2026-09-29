<script setup lang="ts">
import type { ActivityDraftUpdateRequest } from '@/api/avenir-esr'
import type { EditActivityForm } from '@/features/staff/activities/types/forms.types'
import { DatePeriodPicker } from '@/common/components'
import ToggleParameterCard from '@/features/staff/global/components/cards/ToggleParameterCard/ToggleParameterCard.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
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

const startDate = computed(() => startDateField.state.value.value)
const endDate = computed(() => endDateField.state.value.value)

const toggleOverride = ref(false)

const inputEnabled = computed({
  get: () => !!startDate.value || !!endDate.value || toggleOverride.value,
  set: (newValue: boolean) => {
    toggleOverride.value = newValue
    emit('updateExecutionPeriodEnabled', newValue)
    if (!newValue) {
      if (startDate.value) {
        startDateField.api.handleChange(undefined)
      }

      if (endDate.value) {
        endDateField.api.handleChange(undefined)
      }

      emit('autosave', { enableCompletionPeriod: false })
    }
  },
})

function autosaveIfConsistent (start: string | undefined, end: string | undefined) {
  if (start && end) {
    emit('autosave', { startDate: start, endDate: end, enableCompletionPeriod: true })
  }
  else if (!start && !end) {
    emit('autosave', { enableCompletionPeriod: false })
  }
}

function setStartDate (value: string) {
  startDateField.api.handleChange(value)
  autosaveIfConsistent(value || undefined, endDate.value || undefined)
}

function setEndDate (value: string) {
  endDateField.api.handleChange(value)
  autosaveIfConsistent(startDate.value || undefined, value || undefined)
}
</script>

<template>
  <ToggleParameterCard
    v-model="inputEnabled"
    data-testid="execution-period-parameter-toggle"
    :title="t('staff.activities.views.EditNationalActivityView.ActivityExecutionPeriodFormField.title')"
    :icon="MDI_ICONS.CALENDAR_MONTH_OUTLINE"
  >
    <DatePeriodPicker
      v-if="inputEnabled"
      type="date"
      required
      label-visible
      :show-ongoing="false"
      data-testid="activity-execution-period-input"
      :label="t('staff.activities.views.EditNationalActivityView.ActivityExecutionPeriodFormField.periodLabel')"
      :start-date="startDate ?? ''"
      :end-date="endDate"
      :start-date-errors="startDateField.state.value.meta.errors"
      :end-date-errors="endDateField.state.value.meta.errors"
      @update:start-date="setStartDate"
      @update:end-date="setEndDate"
    />
  </ToggleParameterCard>
</template>
