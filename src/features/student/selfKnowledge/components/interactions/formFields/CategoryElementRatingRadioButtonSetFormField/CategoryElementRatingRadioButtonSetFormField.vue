<script setup lang="ts">
import type { AddSelfKnowledgeCategoryElementForm } from '@/features/student/selfKnowledge/types/forms.types'
import CategoryElementRatingRadioButtonSet from '@/features/student/selfKnowledge/components/interactions/inputs/CategoryElementRatingRadioButtonSet/CategoryElementRatingRadioButtonSet.vue'
import { markRaw } from 'vue'

interface CategoryElementRatingInputFormFieldProps {
  form: AddSelfKnowledgeCategoryElementForm
}

const { form } = defineProps<CategoryElementRatingInputFormFieldProps>()
const FormField = markRaw(form.Field)
const ratingField = form.useField({ name: 'rating' })

function onUpdateModelValue (value: (number | undefined)) {
  if (typeof value === 'number') {
    ratingField.api.handleChange(value)
  }
}
</script>

<template>
  <FormField name="rating">
    <template #default="{ field }">
      <CategoryElementRatingRadioButtonSet
        v-bind="$attrs"
        :model-value="field.state.value ?? undefined"
        :error-message="field.state.meta.errors?.join(', ')"
        @blur="field.handleBlur"
        @update:model-value="onUpdateModelValue"
      />
    </template>
  </FormField>
</template>
