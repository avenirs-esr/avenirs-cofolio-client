<script setup lang="ts">
import type { AddDeclaredProgramForm } from '@/features/student/personalCareer/types/forms.types'
import { AvCheckbox, AvPeriodInput } from '@avenirs-esr/avenirs-dsav'
import { markRaw } from 'vue'
import { useI18n } from 'vue-i18n'

interface DeclaredProgramPeriodFormFieldProps {
  form: AddDeclaredProgramForm
}

defineOptions({ inheritAttrs: false })

const { form } = defineProps<DeclaredProgramPeriodFormFieldProps>()
const { t } = useI18n()

const IS_ONGOING = 'isOngoing'
const FormField = markRaw(form.Field)
const startDateField = form.useField({ name: 'startDate' })
const endDateField = form.useField({ name: 'endDate' })
const isOngoingField = form.useField({ name: IS_ONGOING })

const isOngoing = computed(() => Boolean(isOngoingField.state.value.value))

function setStartDate (value: string) {
  startDateField.api.handleChange(value)
}

function setEndDate (value: string) {
  endDateField.api.handleChange(value)
}

function onUpdateIsOngoing (values: (string | number | boolean | undefined)[]) {
  const [value] = values
  const checked = value === IS_ONGOING

  isOngoingField.api.handleChange(checked)

  if (checked) {
    endDateField.api.handleChange('')
  }
}
</script>

<template>
  <div class="declared-program-period-form-field">
    <div class="b2-light av-py-xs">
      {{ t('student.personalCareer.interactions.formFields.DeclaredProgramPeriodFormField.label') }}
    </div>

    <div class="av-col av-gap-xs">
      <FormField :name="IS_ONGOING">
        <template #default="{ field }">
          <AvCheckbox
            id="on-going-declared-program"
            :name="IS_ONGOING"
            :model-value="field.state.value ? [IS_ONGOING] : []"
            :value="IS_ONGOING"
            :label="t('student.personalCareer.interactions.formFields.DeclaredProgramPeriodFormField.ongoing')"
            @update:model-value="onUpdateIsOngoing"
          />
        </template>
      </FormField>

      <AvPeriodInput
        width="10rem"
        type="month"
        :label="t('student.personalCareer.interactions.formFields.DeclaredProgramPeriodFormField.label')"
        label-class="av-hidden"
        :start-label="t('student.personalCareer.interactions.formFields.DeclaredProgramPeriodFormField.startDate')"
        :end-label="t('student.personalCareer.interactions.formFields.DeclaredProgramPeriodFormField.endDate')"
        :ongoing-label="t('student.personalCareer.interactions.formFields.DeclaredProgramPeriodFormField.ongoing')"
        :start-model-value="String(startDateField.state.value.value ?? '')"
        :end-model-value="String(endDateField.state.value.value ?? '')"
        :end-date-disabled="isOngoing"
        :start-error-message="startDateField.state.value.meta.errors?.join(', ')"
        :end-error-message="endDateField.state.value.meta.errors?.join(', ')"
        @update:start-model-value="setStartDate"
        @update:end-model-value="setEndDate"
      />
    </div>
  </div>
</template>
