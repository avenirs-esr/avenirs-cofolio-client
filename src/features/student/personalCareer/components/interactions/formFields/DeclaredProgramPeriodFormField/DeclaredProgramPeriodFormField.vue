<script setup lang="ts">
import type { AddDeclaredProgramForm } from '@/features/student/personalCareer/types/forms.types'

import { AvCheckbox, AvInput, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { markRaw } from 'vue'
import { useI18n } from 'vue-i18n'

interface DeclaredProgramPeriodFormFieldProps {
  form: AddDeclaredProgramForm
}

defineOptions({
  inheritAttrs: false
})

const { form } = defineProps<DeclaredProgramPeriodFormFieldProps>()
const { t } = useI18n()

const IS_ONGOING = 'isOngoing'

const FormField = markRaw(form.Field)
const startDateField = form.useField({ name: 'startDate' })
const endDateField = form.useField({ name: 'endDate' })
const isOngoingField = form.useField({ name: IS_ONGOING })

const isOngoing = computed(() => isOngoingField.state.value.value)

function onUpdateStartDate (value: string | number | null) {
  startDateField.api.handleChange(String(value ?? ''))
}

function onUpdateEndDate (value: string | number | null) {
  endDateField.api.handleChange(String(value ?? ''))
}

function onUpdateIsOngoing (values: (string | number | boolean | undefined)[]) {
  const [value] = values
  isOngoingField.api.handleChange(value === IS_ONGOING)
  if (value) {
    endDateField.api.handleChange('')
  }
}
</script>

<template>
  <div class="declared-program-period-form-field">
    <div class="b2-light av-py-xs">
      {{ t('student.personalCareer.interactions.formFields.DeclaredProgramPeriodFormField.label') }}
    </div>

    <div class="av-flex-col-xs">
      <FormField :name="IS_ONGOING">
        <template #default="{ field }">
          <AvCheckbox
            id="on-going-declared-program"
            :name="IS_ONGOING"
            :model-value="field.state.value ? [IS_ONGOING] : []"
            :value="IS_ONGOING"
            label="En cours"
            @update:model-value="onUpdateIsOngoing"
          />
        </template>
      </FormField>

      <div class="av-row-md">
        <FormField name="startDate">
          <template #default="{ field }">
            <AvInput
              :model-value="field.state.value"
              :label="t('student.personalCareer.interactions.formFields.DeclaredProgramPeriodFormField.startDate')"
              :label-visible="false"
              :placeholder="t('student.personalCareer.interactions.formFields.DeclaredProgramPeriodFormField.startDatePlaceholder')"
              :error-message="field.state.meta.errors?.join(', ')"
              :prefix-icon="MDI_ICONS.CALENDAR_MONTH_OUTLINE"
              type="month"
              @update:model-value="onUpdateStartDate"
            />
          </template>
        </FormField>

        <FormField name="endDate">
          <template #default="{ field }">
            <AvInput
              :model-value="field.state.value"
              :label="t('student.personalCareer.interactions.formFields.DeclaredProgramPeriodFormField.endDate')"
              :placeholder="t('student.personalCareer.interactions.formFields.DeclaredProgramPeriodFormField.endDatePlaceholder')"
              :error-message="field.state.meta.errors?.join(', ')"
              :prefix-icon="MDI_ICONS.CALENDAR_MONTH_OUTLINE"
              type="month"
              :disabled="isOngoing"
              :label-visible="false"
              @update:model-value="onUpdateEndDate"
            />
          </template>
        </FormField>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.declared-program-period-form-field {
  :deep(.av-fieldset__element) {
    padding-left: 0;
  }
}
</style>
