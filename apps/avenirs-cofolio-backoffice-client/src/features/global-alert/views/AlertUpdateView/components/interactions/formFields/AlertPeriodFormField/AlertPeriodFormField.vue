<script setup lang="ts">
import type { AlertUpdateForm } from '@/features/global-alert/views/AlertUpdateView/composables/use-update-alert-form/use-update-alert-form'
import { DatePeriodPicker } from '@avenirs-esr/shared'
import { useI18n } from 'vue-i18n'

export interface AlertPeriodFormFieldProps {
  form: AlertUpdateForm
  disabled?: boolean
}

const { form, disabled } = defineProps<AlertPeriodFormFieldProps>()

const { t } = useI18n()

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
    type="datetime-local"
    input-format="dd/MM/yyyy HH:mm"
    output-format="dd/MM/yyyy HH:mm"
    :disabled
    :label="t('global-alert.views.AlertUpdateView.components.AlertPeriod')"
    label-visible
    :show-ongoing="false"
    :start-date="startDateField.state.value.value ?? ''"
    :end-date="endDateField.state.value.value"
    :start-date-errors="startDateField.state.value.meta.errors"
    :end-date-errors="endDateField.state.value.meta.errors"
    @update:start-date="handleStartDateChange"
    @update:end-date="handleEndDateChange"
  />
</template>
