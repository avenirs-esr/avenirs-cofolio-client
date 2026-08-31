<script setup lang="ts">
import type { ActivityDraftUpdateRequest } from '@/api/avenir-esr'
import type { EditActivityForm } from '@/features/activities/types/forms.types'
import Input from '@/common/components/interaction/inputs/Input/Input.vue'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import { ACTIVITY_RECOMMENDED_COMPLETION_CONTEXTS_MAX_LENGTH } from '@/features/activities/config'
import { markRaw } from 'vue'

interface ActivityRecommendedCompletionContextsFormFieldProps {
  form: EditActivityForm
  minHeight?: string
}

defineOptions({ inheritAttrs: false })

const { form, minHeight = '17.3125rem' } = defineProps<ActivityRecommendedCompletionContextsFormFieldProps>()
const emit = defineEmits<{
  autosave: [value: ActivityDraftUpdateRequest]
}>()

const { validateMaxLength } = useFormValidators()
const FormField = markRaw(form.Field)

const recommendedCompletionContextsValidators = {
  onChange: ({ value }: { value: string }) => validateMaxLength(value, ACTIVITY_RECOMMENDED_COMPLETION_CONTEXTS_MAX_LENGTH),
}

const recommendedCompletionContextsField = form.useField({ name: 'recommendedCompletionContexts' })
</script>

<template>
  <FormField
    name="recommendedCompletionContexts"
    :validators="recommendedCompletionContextsValidators"
  >
    <template #default="{ field }">
      <Input
        v-bind="$attrs"
        data-testid="activity-recommended-completion-contexts-input"
        is-textarea
        :textarea-min-height="minHeight"
        :model-value="field.state.value"
        :maxlength="ACTIVITY_RECOMMENDED_COMPLETION_CONTEXTS_MAX_LENGTH"
        :error-message="field.state.meta.errors?.join(', ')"
        @update:model-value="(value) => { field.handleChange(String(value) ?? ''); if (!recommendedCompletionContextsField.state.value.meta.errors.length) { emit('autosave', { recommendedCompletionContexts: String(value) ?? '' }) } }"
      />
    </template>
  </FormField>
</template>
