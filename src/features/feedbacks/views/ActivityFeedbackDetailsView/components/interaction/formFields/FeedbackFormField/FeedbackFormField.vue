<script setup lang="ts">
import type { UpdateFeedbackRequest } from '@/api/avenir-esr'
import type { WriteFeedbackForm } from '@/features/feedbacks/types/forms.types'
import FeedbackTextarea from '@/features/feedbacks/views/ActivityFeedbackDetailsView/components/interaction/inputs/FeedbackTextarea/FeedbackTextarea.vue'
import { markRaw } from 'vue'

interface FeedbackFormFieldProps {
  form: WriteFeedbackForm
  readonly?: boolean
}

const { form, readonly } = defineProps<FeedbackFormFieldProps>()

const emit = defineEmits<{
  autosave: [value: UpdateFeedbackRequest]
}>()

const FormField = markRaw(form.Field)
</script>

<template>
  <FormField name="feedback">
    <template #default="{ field }">
      <FeedbackTextarea
        v-bind="$attrs"
        :model-value="field.state.value ?? ''"
        :error-message="field.state.meta.errors?.join(', ')"
        :disabled="readonly"
        @blur="field.handleBlur"
        @update:model-value="(value) => {
          field.handleChange(value ?? '');
          if (!field.state.meta.errors.length) {
            emit('autosave', { feedback: value ?? '' })
          }
        }"
      />
    </template>
  </FormField>
</template>
