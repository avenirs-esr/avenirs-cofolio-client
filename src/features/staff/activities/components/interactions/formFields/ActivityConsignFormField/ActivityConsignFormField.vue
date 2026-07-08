<script setup lang="ts">
import type { ActivityDraftUpdateRequest } from '@/api/avenir-esr'
import type { EditActivityForm } from '@/features/staff/activities/types/forms.types'
import RichTextEditor from '@/common/components/interaction/inputs/RichTextEditor/RichTextEditor.vue'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import { ACTIVITY_AUTO_SAVE_DEBOUNCE, ACTIVITY_CONSIGN_MAX_LENGTH } from '@/features/staff/activities/config'
import { debounce } from 'lodash-es'
import { markRaw } from 'vue'

interface ActivityConsignFormFieldProps {
  form: EditActivityForm
}

const { form } = defineProps<ActivityConsignFormFieldProps>()

const emit = defineEmits<{
  autosave: [value: ActivityDraftUpdateRequest]
}>()

const { validateMaxLength } = useFormValidators()
const FormField = markRaw(form.Field)
const descriptionField = form.useField({ name: 'description' })
const descriptionValidators = {
  onChange: ({ value }: { value: string }) => validateMaxLength(value, ACTIVITY_CONSIGN_MAX_LENGTH),
}

const isFormDirty = form.useStore(state => state.isDirty)
const charCount = ref(0)

const debouncedAutosave = debounce((value: string, hasErrors: boolean) => {
  if (isFormDirty.value && !hasErrors) {
    emit('autosave', { description: value })
  }
}, ACTIVITY_AUTO_SAVE_DEBOUNCE)

function onChange (value?: string) {
  const nextValue = charCount.value > 0 && value ? value : ''
  descriptionField.api.handleChange(nextValue)
  debouncedAutosave(nextValue, descriptionField.api.getMeta().errors.length > 0)
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
        @update:model-value="onChange"
      />
    </template>
  </FormField>
</template>
