<script setup lang="ts">
import type { AddDeclaredExperienceForm } from '@/features/student/personalCareer/types/forms.types'
import DeclaredExperienceReviewTextarea from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceReviewTextarea/DeclaredExperienceReviewTextarea.vue'
import { DECLARED_EXPERIENCE_REVIEW_MAX_LENGTH } from '@/features/student/personalCareer/config'
import { markRaw } from 'vue'

interface DeclaredExperienceReviewFormFieldProps {
  form: AddDeclaredExperienceForm
}

defineOptions({
  inheritAttrs: false
})

const { form } = defineProps<DeclaredExperienceReviewFormFieldProps>()
const FormField = markRaw(form.Field)
const reviewField = form.useField({ name: 'review' })

function onUpdateReview (value: string | undefined) {
  reviewField.api.handleChange(String(value ?? '').slice(0, DECLARED_EXPERIENCE_REVIEW_MAX_LENGTH))
}
</script>

<template>
  <FormField name="review">
    <template #default="{ field }">
      <DeclaredExperienceReviewTextarea
        v-bind="$attrs"
        :model-value="(field.state.value ?? '').slice(0, DECLARED_EXPERIENCE_REVIEW_MAX_LENGTH)"
        :error-message="field.state.meta.errors?.join(', ')"
        @blur="field.handleBlur"
        @update:model-value="onUpdateReview"
      />
    </template>
  </FormField>
</template>
