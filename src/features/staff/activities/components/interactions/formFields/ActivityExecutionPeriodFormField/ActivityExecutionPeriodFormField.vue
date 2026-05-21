<script setup lang="ts">
import type { ActivityDraftUpdateRequest } from '@/api/avenir-esr'
import type { EditActivityForm } from '@/features/staff/activities/types/forms.types'
import RichTextEditor from '@/common/components/interaction/inputs/RichTextEditor/RichTextEditor.vue'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import {
  ACTIVITY_AUTO_SAVE_DEBOUNCE,
  ACTIVITY_EXECUTION_PERIOD_MAX_LENGTH
} from '@/features/staff/activities/config'
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

const executionPeriodInfoValidators = {
  onChange: ({ value }: { value: string }) => validateMaxLength(value, ACTIVITY_EXECUTION_PERIOD_MAX_LENGTH),
}

const isFormDirty = form.useStore(state => state.isDirty)

const debouncedAutosave = debounce((value: string) => {
  if (isFormDirty.value) {
    emit('autosave', { executionPeriodInfo: value })
  }
}, ACTIVITY_AUTO_SAVE_DEBOUNCE)
</script>

<template>
  <FormField
    name="executionPeriodInfo"
    :validators="executionPeriodInfoValidators"
  >
    <template #default="{ field }">
      <RichTextEditor
        :model-value="field.state.value"
        :maxlength="ACTIVITY_EXECUTION_PERIOD_MAX_LENGTH"
        :error-message="field.state.meta.errors?.join(', ')"
        @update:model-value="(value) => { field.handleChange(value ?? ''); debouncedAutosave(value ?? '') }"
      />
    </template>
  </FormField>
</template>
