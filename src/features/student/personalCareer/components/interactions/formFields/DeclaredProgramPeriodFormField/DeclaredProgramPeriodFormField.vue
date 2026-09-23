<script setup lang="ts">
import type { AddDeclaredProgramForm } from '@/features/student/personalCareer/types/forms.types'
import { DatePeriodPicker } from '@/common/components'
import { useI18n } from 'vue-i18n'

interface DeclaredProgramPeriodFormFieldProps {
  form: AddDeclaredProgramForm
}

defineOptions({ inheritAttrs: false })

const { form } = defineProps<DeclaredProgramPeriodFormFieldProps>()
const { t } = useI18n()

const IS_ONGOING = 'isOngoing'
const startDateField = form.useField({ name: 'startDate' })
const endDateField = form.useField({ name: 'endDate' })
const isOngoingField = form.useField({ name: IS_ONGOING })

function onUpdateStartDate (value: string) {
  startDateField.api.handleChange(value)
}

function onUpdateEndDate (value: string) {
  endDateField.api.handleChange(value)
}

const isOngoing = computed(() => Boolean(isOngoingField.state.value.value))
</script>

<template>
  <div class="declared-program-period-form-field">
    <DatePeriodPicker
      v-bind="$attrs"
      :start-date="String(startDateField.state.value.value ?? '')"
      :end-date="String(endDateField.state.value.value ?? '')"
      :is-ongoing="isOngoing"
      :label="t('student.personalCareer.interactions.formFields.DeclaredProgramPeriodFormField.label')"
      :ongoing-label="t('student.personalCareer.interactions.formFields.DeclaredProgramPeriodFormField.ongoing')"
      type="month"
      :start-date-errors="startDateField.state.value.meta.errors"
      :end-date-errors="endDateField.state.value.meta.errors"
      required
      @update:start-date="onUpdateStartDate"
      @update:end-date="onUpdateEndDate"
      @update:is-ongoing="value => isOngoingField.api.handleChange(value)"
    />
  </div>
</template>
