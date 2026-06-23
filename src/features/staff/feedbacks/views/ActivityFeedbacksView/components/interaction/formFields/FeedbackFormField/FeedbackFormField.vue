<script setup lang="ts">
import type { UpdateFeedbackRequest } from '@/api/avenir-esr'
import type { WriteFeedbackForm } from '@/features/staff/feedbacks/types/forms.types'
import { AUTO_SAVE_DEBOUNCE_DELAY } from '@/common/constants'
import FeedbackTextarea from '@/features/staff/feedbacks/views/ActivityFeedbacksView/components/interaction/inputs/FeedbackTextarea/FeedbackTextarea.vue'
import { debounce } from 'lodash-es'
import { markRaw } from 'vue'

interface FeedbackFormFieldProps {
  form: WriteFeedbackForm
}

const { form } = defineProps<FeedbackFormFieldProps>()

const emit = defineEmits<{
  autosave: [value: UpdateFeedbackRequest]
}>()

const FormField = markRaw(form.Field)

const isFormDirty = form.useStore(state => state.isDirty)

const debouncedAutosave = debounce((value: string, hasErrors: boolean) => {
  if (!hasErrors && isFormDirty.value) {
    emit('autosave', { feedback: value })
  }
}, AUTO_SAVE_DEBOUNCE_DELAY)
</script>

<template>
  <FormField name="feedback">
    <template #default="{ field }">
      <FeedbackTextarea
        v-bind="$attrs"
        :model-value="field.state.value ?? ''"
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
