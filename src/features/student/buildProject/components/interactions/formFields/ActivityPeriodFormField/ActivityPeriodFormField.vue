<script setup lang="ts">
import type { SubscribeActivityForm, UpdateActivityForm } from '@/features/student/buildProject/types/forms.types'
import { AvPeriodInput } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface ActivityPeriodFormFieldProps {
  form: UpdateActivityForm | SubscribeActivityForm
  label?: string
  startMinDate?: Date
}

const { form, label } = defineProps<ActivityPeriodFormFieldProps>()
const { t } = useI18n()

const periodForm = form as SubscribeActivityForm
const startDateField = periodForm.useField({ name: 'startDate' })
const endDateField = periodForm.useField({ name: 'endDate' })

function setStartDate (value: string) {
  startDateField.api.handleChange(value)
}

function setEndDate (value: string) {
  endDateField.api.handleChange(value)
}
</script>

<template>
  <AvPeriodInput
    :label="label ?? t('student.buildProject.activities.interactions.formFields.ActivityPeriodFormField.label')"
    :start-min-date="startMinDate"
    :start-model-value="startDateField.state.value.value ?? ''"
    :end-model-value="endDateField.state.value.value ?? ''"
    :start-error-message="startDateField.state.value.meta.errors?.join(', ')"
    :end-error-message="endDateField.state.value.meta.errors?.join(', ')"
    @update:start-model-value="setStartDate"
    @update:end-model-value="setEndDate"
  />
</template>
