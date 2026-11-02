<script setup lang="ts">
import type { WriteAssessmentForm } from '@/features/staff/assessments/types/forms.types'
import { markRaw } from 'vue'
import { useI18n } from 'vue-i18n'
import Input from '@/common/components/interaction/inputs/Input/Input.vue'
import { ASSESSMENT_COMMENT_MAX_LENGTH } from '@/features/staff/assessments/config'

interface AssessmentCommentFormFieldProps {
  form: WriteAssessmentForm
  required?: boolean
  readonly?: boolean
}

const { form, required, readonly } = defineProps<AssessmentCommentFormFieldProps>()

const { t } = useI18n()
const FormField = markRaw(form.Field)
</script>

<template>
  <FormField name="comment">
    <template #default="{ field }">
      <Input
        id="assessment-comment"
        is-textarea
        :label="t('staff.assessments.views.ActivityAssessmentDetailsView.AssessmentManagementFloatingPanel.formFields.AssessmentCommentFormField.label')"
        label-visible
        :required="required"
        :maxlength="ASSESSMENT_COMMENT_MAX_LENGTH"
        textarea-min-height="var(--dimension-7xl)"
        :disabled="readonly"
        :model-value="field.state.value"
        :error-message="field.state.meta.errors?.join(', ')"
        data-testid="assessment-comment-form-field"
        @blur="field.handleBlur"
        @update:model-value="(value) => field.handleChange(value?.toString() ?? '')"
      />
    </template>
  </FormField>
</template>

<style lang="scss" scoped>
:deep(textarea) {
  resize: none !important;
}
</style>
