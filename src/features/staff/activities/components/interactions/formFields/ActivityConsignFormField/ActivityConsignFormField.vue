<script setup lang="ts">
import type { ActivityDraftUpdateRequest } from '@/api/avenir-esr'
import type { EditActivityForm } from '@/features/staff/activities/types/forms.types'
import RichTextEditor from '@/common/components/interaction/inputs/RichTextEditor/RichTextEditor.vue'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import { ACTIVITY_CONSIGN_MAX_LENGTH } from '@/features/staff/activities/config'
import { markRaw } from 'vue'

interface ActivityConsignFormFieldProps {
  form: EditActivityForm
}

const { form } = defineProps<ActivityConsignFormFieldProps>()

const emit = defineEmits<{
  autosave: [value: ActivityDraftUpdateRequest]
}>()

const { validateMaxLength } = useFormValidators()
const charCount = ref<number>()

const FormField = markRaw(form.Field)
const descriptionField = form.useField({ name: 'description' })
const descriptionValidators = {
  onChange: ({ value: _ }: { value: string }) => validateMaxLength('a'.repeat(charCount.value ?? 0), ACTIVITY_CONSIGN_MAX_LENGTH),
}
</script>

<template>
  <FormField
    name="description"
    :validators="descriptionValidators"
  >
    <template #default="{ field }">
      <RichTextEditor
        v-model:char-count="charCount"
        data-testid="activity-consign-form-field"
        :model-value="field.state.value"
        :maxlength="ACTIVITY_CONSIGN_MAX_LENGTH"
        :error-message="field.state.meta.errors?.join(', ')"
        @update:model-value="(value) => {
          field.handleChange(!!value && value !== '<p></p>' ? value : '');
          if (!descriptionField.state.value.meta.errors.length) {
            emit('autosave', { description: !!value && value !== '<p></p>' ? value : '' })
          }
        }"
      />
    </template>
  </FormField>
</template>
