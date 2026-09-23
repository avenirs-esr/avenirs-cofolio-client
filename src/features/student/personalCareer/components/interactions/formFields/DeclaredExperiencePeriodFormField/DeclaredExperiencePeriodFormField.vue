<script setup lang="ts">
import type { AddDeclaredExperienceForm, UpdateDeclaredExperienceForm } from '@/features/student/personalCareer/types/forms.types'
import { DatePeriodPicker } from '@/common/components'

interface DeclaredExperiencePeriodFormFieldProps {
  form: AddDeclaredExperienceForm | UpdateDeclaredExperienceForm
}

defineOptions({
  inheritAttrs: false
})

const { form } = defineProps<DeclaredExperiencePeriodFormFieldProps>()

const startDateField = form.useField({ name: 'startDate' })
const endDateField = form.useField({ name: 'endDate' })
const isOngoingField = form.useField({ name: 'isOngoing' })

function onUpdateStartDate (value: string) {
  startDateField.api.handleChange(value)
}

function onUpdateEndDate (value: string) {
  endDateField.api.handleChange(value)
}

const isOngoing = computed(() => Boolean(isOngoingField.state.value.value))
</script>

<template>
  <div class="declared-experience-period-form-field">
    <DatePeriodPicker
      v-bind="$attrs"
      required
      :start-date="String(startDateField.state.value.value ?? '')"
      :end-date="String(endDateField.state.value.value)"
      :is-ongoing="isOngoing"
      :start-date-errors="startDateField.state.value.meta.errors"
      :end-date-errors="endDateField.state.value.meta.errors"
      @update:start-date="onUpdateStartDate"
      @update:end-date="onUpdateEndDate"
      @update:is-ongoing="(value:boolean) => isOngoingField.api.handleChange(value)"
    />
  </div>
</template>
