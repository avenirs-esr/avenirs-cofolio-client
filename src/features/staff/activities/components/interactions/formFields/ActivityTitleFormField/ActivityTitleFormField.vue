<script setup lang="ts">
import type { ActivityDraftUpdateRequest } from '@/api/avenir-esr'
import type { ActivityDraftCreationForm, EditActivityForm } from '@/features/staff/activities/types/forms.types'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import ActivityTitleInput from '@/features/staff/activities/components/interactions/inputs/ActivityTitleInput/ActivityTitleInput.vue'
import { ACTIVITY_AUTO_SAVE_DEBOUNCE, ACTIVITY_TITLE_MAX_LENGTH } from '@/features/staff/activities/config'
import { debounce } from 'lodash-es'
import { markRaw } from 'vue'

interface ActivityTitleFormFieldProps {
  form: ActivityDraftCreationForm | EditActivityForm
}

defineOptions({
  inheritAttrs: false
})

const { form } = defineProps<ActivityTitleFormFieldProps>()

const emit = defineEmits<{
  autosave: [value: ActivityDraftUpdateRequest]
}>()

const { validateRequired, validateMaxLength } = useFormValidators()
const FormField = markRaw(form.Field)

const validateTitle = (value: string) => validateRequired(value) || validateMaxLength(value, ACTIVITY_TITLE_MAX_LENGTH)

const titleValidators = {
  onChange: ({ value }: { value: string }) => validateTitle(value),
  onSubmit: ({ value }: { value: string }) => validateTitle(value),
}

const isFormDirty = form.useStore(state => state.isDirty)

const debouncedAutosave = debounce((value: string, hasErrors: boolean) => {
  if (!hasErrors && isFormDirty.value) {
    emit('autosave', { title: value })
  }
}, ACTIVITY_AUTO_SAVE_DEBOUNCE)
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
        @update:model-value="(value) => {
          field.handleChange(value ?? '');
          debouncedAutosave(value ?? '', field.state.meta.errors.length > 0)
        }"
      />
    </template>
  </FormField>
</template>
