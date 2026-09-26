<script setup lang="ts">
import type { UpdateActivityForm } from '@/features/student/global/types/forms.types'
import { DatePeriodPicker } from '@/common/components'
import { useI18n } from 'vue-i18n'

interface ActivityPeriodFormFieldProps {
  form: UpdateActivityForm
  label?: string
  startMinDate?: Date
}

const { form, label } = defineProps<ActivityPeriodFormFieldProps>()
const { t } = useI18n()

const startDateField = form.useField({ name: 'startDate' })
const endDateField = form.useField({ name: 'endDate' })

function setStartDate (value: string) {
  startDateField.api.handleChange(value)
}

function setEndDate (value: string) {
  endDateField.api.handleChange(value)
}
</script>

<template>
  <DatePeriodPicker
    type="date"
    :is-ongoing="false"
    :show-ongoing="false"
    :label="label ?? t('student.activities.interactions.formFields.ActivityPeriodFormField.label')"
    :min-date="startMinDate"
    :start-date="String(startDateField.state.value.value ?? '')"
    :end-date="String(endDateField.state.value.value ?? '')"
    :start-date-errors="startDateField.state.value.meta.errors"
    :end-date-errors="endDateField.state.value.meta.errors"
    @update:start-date="setStartDate"
    @update:end-date="setEndDate"
  />
</template>
