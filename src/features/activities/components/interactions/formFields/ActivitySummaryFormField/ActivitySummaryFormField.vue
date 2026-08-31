<script setup lang="ts">
import type { ActivityDraftUpdateRequest } from '@/api/avenir-esr'
import type { EditActivityForm } from '@/features/activities/types/forms.types'
import Input from '@/common/components/interaction/inputs/Input/Input.vue'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import { ACTIVITY_SUMMARY_MAX_LENGTH } from '@/features/activities/config'
import { markRaw } from 'vue'
import { useI18n } from 'vue-i18n'

interface ActivitySummaryFormFieldProps {
  form: EditActivityForm
}

const { form } = defineProps<ActivitySummaryFormFieldProps>()

const emit = defineEmits<{
  autosave: [value: ActivityDraftUpdateRequest]
}>()

const { t } = useI18n()
const { validateRequired, validateMaxLength } = useFormValidators()
const FormField = markRaw(form.Field)

const validateSummary = (value: string) => validateRequired(value) || validateMaxLength(value, ACTIVITY_SUMMARY_MAX_LENGTH)

const summaryValidators = {
  onChange: ({ value }: { value: string }) => validateSummary(value),
  onSubmit: ({ value }: { value: string }) => validateSummary(value),
}
</script>

<template>
  <FormField
    name="summary"
    :validators="summaryValidators"
  >
    <template #default="{ field }">
      <Input
        data-testid="activity-summary-input"
        :model-value="field.state.value"
        :maxlength="ACTIVITY_SUMMARY_MAX_LENGTH"
        :placeholder="t('staff.activities.views.EditNationalActivityView.ActivitySummaryFormField.placeholder')"
        :error-message="field.state.meta.errors?.join(', ')"
        textarea-min-height="17.3125rem"
        is-textarea
        @update:model-value="(value) => {
          field.handleChange(value?.toString() ?? '');
          if (!field.state.meta.errors.length) { emit('autosave', { summary: value?.toString() ?? '' }) }
        }"
      />
    </template>
  </FormField>
</template>
