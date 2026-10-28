<script setup lang="ts">
import type { WriteAssessmentForm, WriteAssessmentFormData } from '@/features/staff/assessments/types/forms.types'
import { AvIconText, AvRadioButton, AvRadioButtonSet, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { markRaw } from 'vue'
import { useI18n } from 'vue-i18n'
import { isEnumMember } from '@/common/utils'
import { WriteAssessmentFormDataValidationOption } from '@/features/staff/assessments/types/forms.types'

interface AssessmentValidationFormFieldProps {
  form: WriteAssessmentForm
  readonly?: boolean
}

const { form, readonly } = defineProps<AssessmentValidationFormFieldProps>()

const { t } = useI18n()
const FormField = markRaw(form.Field)

function toOption (validation: WriteAssessmentFormData['validation']) {
  if (validation === null) {
    return undefined
  }
  return validation ? WriteAssessmentFormDataValidationOption.VALIDATED : WriteAssessmentFormDataValidationOption.NOT_VALIDATED
}

function fromOption (option: unknown): WriteAssessmentFormData['validation'] {
  if (typeof option !== 'string' || !isEnumMember(WriteAssessmentFormDataValidationOption, option)) {
    return null
  }
  return option === WriteAssessmentFormDataValidationOption.VALIDATED
}
</script>

<template>
  <FormField name="validation">
    <template #default="{ field }">
      <div data-testid="assessment-validation-form-field">
        <AvRadioButtonSet
          name="assessment-validation"
          :legend="t('staff.assessments.views.ActivityAssessmentDetailsView.AssessmentManagementFloatingPanel.formFields.AssessmentValidationFormField.legend')"
          :model-value="toOption(field.state.value)"
          :error-message="field.state.meta.errors?.join(', ')"
          :disabled="readonly"
          required
          inline
          @update:model-value="(value) => field.handleChange(fromOption(value))"
        >
          <AvRadioButton
            :value="WriteAssessmentFormDataValidationOption.VALIDATED"
            data-testid="assessment-validated-option"
          >
            <AvIconText
              :icon="MDI_ICONS.CHECK_CIRCLE_OUTLINE"
              icon-color="var(--dark-background-success)"
              :text="t('staff.assessments.views.ActivityAssessmentDetailsView.AssessmentManagementFloatingPanel.formFields.AssessmentValidationFormField.validated')"
              typography-class="b2-bold"
              gap="var(--spacing-xxs)"
            />
          </AvRadioButton>
          <AvRadioButton
            :value="WriteAssessmentFormDataValidationOption.NOT_VALIDATED"
            data-testid="assessment-not-validated-option"
          >
            <AvIconText
              :icon="MDI_ICONS.CLOSE_CIRCLE_OUTLINE"
              icon-color="var(--dark-background-error)"
              :text="t('staff.assessments.views.ActivityAssessmentDetailsView.AssessmentManagementFloatingPanel.formFields.AssessmentValidationFormField.notValidated')"
              typography-class="b2-bold"
              gap="var(--spacing-xxs)"
            />
          </AvRadioButton>
        </AvRadioButtonSet>
      </div>
    </template>
  </FormField>
</template>
