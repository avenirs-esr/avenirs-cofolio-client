<script setup lang="ts">
import type { ActivityDraftUpdateRequest } from '@/api/avenir-esr'
import type { EditActivityForm } from '@/features/staff/activities/types/forms.types'
import Input from '@/common/components/interaction/inputs/Input/Input.vue'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import { ACTIVITY_EXECUTION_PERIOD_MAX_LENGTH } from '@/features/staff/activities/config'
import { markRaw } from 'vue'

interface ActivityConsignFormFieldProps {
  form: EditActivityForm
  minHeight?: string
}

defineOptions({ inheritAttrs: false })

const { form, minHeight = '17.3125rem' } = defineProps<ActivityConsignFormFieldProps>()
const emit = defineEmits<{
  autosave: [value: ActivityDraftUpdateRequest]
}>()

const { validateMaxLength } = useFormValidators()
const FormField = markRaw(form.Field)

const executionPeriodInfoValidators = {
  onChange: ({ value }: { value: string }) => validateMaxLength(value, ACTIVITY_EXECUTION_PERIOD_MAX_LENGTH),
}

const executionPeriodField = form.useField({ name: 'executionPeriodInfo' })
</script>

<template>
  <FormField
    name="executionPeriodInfo"
    :validators="executionPeriodInfoValidators"
  >
    <template #default="{ field }">
      <Input
        v-bind="$attrs"
        data-testid="activity-execution-period-input"
        is-textarea
        :textarea-min-height="minHeight"
        :model-value="field.state.value"
        :maxlength="ACTIVITY_EXECUTION_PERIOD_MAX_LENGTH"
        :error-message="field.state.meta.errors?.join(', ')"
        @update:model-value="(value) => { field.handleChange(String(value) ?? ''); if (!executionPeriodField.state.value.meta.errors.length) { emit('autosave', { executionPeriodInfo: String(value) ?? '' }) } }"
      />
    </template>
  </FormField>
</template>
