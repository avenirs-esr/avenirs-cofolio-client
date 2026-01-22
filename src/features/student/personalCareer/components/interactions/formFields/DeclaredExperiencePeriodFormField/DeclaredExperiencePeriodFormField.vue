<script setup lang="ts">
import type { AddDeclaredExperienceForm } from '@/features/student/personalCareer/types/forms.types'
import DeclaredExperiencePeriodInput from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperiencePeriodInput/DeclaredExperiencePeriodInput.vue'
import { AvCheckbox } from '@avenirs-esr/avenirs-dsav'
import { markRaw } from 'vue'
import { useI18n } from 'vue-i18n'

interface DeclaredExperiencePeriodFormFieldProps {
  form: AddDeclaredExperienceForm
}

defineOptions({
  inheritAttrs: false
})

const { form } = defineProps<DeclaredExperiencePeriodFormFieldProps>()
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

const startErrorMessage = computed(() => startDateField.state.value.meta.errors?.join(', '))
const endErrorMessage = computed(() => endDateField.state.value.meta.errors?.join(', '))
</script>

<template>
  <div class="declared-experience-period-form-field">
    <div class="av-col av-gap-xs">
      <span class="av-label b2-light">
        {{ t('student.personalCareer.interactions.inputs.DeclaredExperiencePeriodInput.label') }}
      </span>
      <FormField :name="IS_ONGOING">
        <template #default="{ field }">
          <AvCheckbox
            id="on-going-declared-experience"
            :name="IS_ONGOING"
            :model-value="field.state.value ? [IS_ONGOING] : []"
            :value="IS_ONGOING"
            :label="t('student.personalCareer.interactions.formFields.DeclaredExperiencePeriodFormField.ongoing')"
            @update:model-value="onUpdateIsOngoing"
          />
        </template>
      </FormField>

      <DeclaredExperiencePeriodInput
        :label-visible="false"
        :start-model-value="startDateField.state.value.value"
        :end-model-value="endDateField.state.value.value"
        :start-error-message="startErrorMessage"
        :end-error-message="endErrorMessage"
        :end-date-disabled="isOngoing"
        @update:start-model-value="onUpdateStartDate"
        @update:end-model-value="onUpdateEndDate"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.declared-experience-period-form-field {
  :deep(.av-fieldset__element) {
    padding-left: 0 !important;
  }
}
</style>
