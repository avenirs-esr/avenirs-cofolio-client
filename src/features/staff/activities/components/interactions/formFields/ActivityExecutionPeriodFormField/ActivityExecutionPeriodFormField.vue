<script setup lang="ts">
import type { ActivityDraftUpdateRequest } from '@/api/avenir-esr'
import type { EditActivityForm } from '@/features/staff/activities/types/forms.types'
import Input from '@/common/components/interaction/inputs/Input/Input.vue'
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

defineOptions({ inheritAttrs: false })

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
const executionPeriodField = form.useField({ name: 'executionPeriodInfo' })

const debouncedAutosave = debounce((value: string) => {
  const hasErrors = executionPeriodField.state.value.meta.errors.length > 0
  if (isFormDirty.value && !hasErrors) {
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
      <Input
        v-bind="$attrs"
        is-textarea
        textarea-min-height="15rem"
        :model-value="field.state.value"
        :maxlength="ACTIVITY_EXECUTION_PERIOD_MAX_LENGTH"
        :error-message="field.state.meta.errors?.join(', ')"
        @update:model-value="(value) => { field.handleChange(String(value) ?? ''); debouncedAutosave(String(value) ?? '') }"
      />
    </template>
  </FormField>
</template>
