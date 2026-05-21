<script setup lang="ts">
import type { ActivityDraftCreationForm, EditActivityForm } from '@/features/staff/activities/types/forms.types'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import ActivityTitleInput from '@/features/staff/activities/components/interactions/inputs/ActivityTitleInput/ActivityTitleInput.vue'
import { ACTIVITY_TITLE_MAX_LENGTH } from '@/features/staff/activities/config'
import { markRaw } from 'vue'

interface ActivityTitleFormFieldProps {
  form: ActivityDraftCreationForm | EditActivityForm
}

defineOptions({
  inheritAttrs: false
})

const { form } = defineProps<ActivityTitleFormFieldProps>()

const { validateRequired, validateMaxLength } = useFormValidators()
const FormField = markRaw(form.Field)

const titleValidators = {
  onChange: ({ value }: { value: string }) => validateRequired(value) || validateMaxLength(value, ACTIVITY_TITLE_MAX_LENGTH),
}
</script>

<template>
  <FormField
    name="title"
    :validators="titleValidators"
  >
    <template #default="{ field }">
      <ActivityTitleInput
        v-bind="$attrs"
        data-testid="activity-title-form-field"
        :model-value="field.state.value"
        :error-message="field.state.meta.errors?.join(', ')"
        @blur="field.handleBlur"
        @update:model-value="(value) => field.handleChange(value ?? '')"
      />
    </template>
  </FormField>
</template>
