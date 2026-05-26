<script setup lang="ts">
import type { ActivityDraftUpdateRequest } from '@/api/avenir-esr'
import type { EditActivityForm } from '@/features/staff/activities/types/forms.types'
import Input from '@/common/components/interaction/inputs/Input/Input.vue'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import { ACTIVITY_AUTO_SAVE_DEBOUNCE, ACTIVITY_SUMMARY_MAX_LENGTH } from '@/features/staff/activities/config'
import { debounce } from 'lodash-es'
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

const isFormDirty = form.useStore(state => state.isDirty)

const debouncedAutosave = debounce((value: string, hasErrors: boolean) => {
  if (!hasErrors && isFormDirty.value) {
    emit('autosave', { summary: value })
  }
}, ACTIVITY_AUTO_SAVE_DEBOUNCE)
</script>

<template>
  <FormField
    name="summary"
    :validators="summaryValidators"
  >
    <template #default="{ field }">
      <Input
        :model-value="field.state.value"
        :maxlength="ACTIVITY_SUMMARY_MAX_LENGTH"
        :placeholder="t('staff.activities.views.EditNationalActivityView.ActivitySummaryFormField.placeholder')"
        :error-message="field.state.meta.errors?.join(', ')"
        textarea-min-height="17.3125rem"
        is-textarea
        @update:model-value="(value) => {
          field.handleChange(value?.toString() ?? '');
          debouncedAutosave(value?.toString() ?? '', field.state.meta.errors.length > 0)
        }"
      />
    </template>
  </FormField>
</template>
