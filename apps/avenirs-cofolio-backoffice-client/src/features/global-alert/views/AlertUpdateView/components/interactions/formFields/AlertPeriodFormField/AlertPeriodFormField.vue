<script setup lang="ts">
import type { AlertUpdateForm } from '@/features/global-alert/views/AlertUpdateView/composables/use-update-alert-form/use-update-alert-form'
import { DatePeriodPicker } from '@avenirs-esr/shared'

export interface AlertPeriodFormFieldProps {
  form: AlertUpdateForm
  disabled?: boolean
}

const { form, disabled } = defineProps<AlertPeriodFormFieldProps>()

const startDateField = form.useField({ name: 'startDate' })
const endDateField = form.useField({ name: 'endDate' })

function handleStartDateChange (value: string) {
  startDateField.api.handleChange(value || undefined)
}

function handleEndDateChange (value?: string) {
  endDateField.api.handleChange(value || undefined)
}
</script>

<template>
  <DatePeriodPicker
    type="date"
    :disabled
    :show-ongoing="false"
    :start-date="startDateField.state.value.value ?? ''"
    :end-date="endDateField.state.value.value"
    :start-date-errors="startDateField.state.value.meta.errors"
    :end-date-errors="endDateField.state.value.meta.errors"
    @update:start-date="handleStartDateChange"
    @update:end-date="handleEndDateChange"
  />
</template>
