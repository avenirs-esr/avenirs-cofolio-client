<script setup lang="ts">
import type { AddSelfKnowledgeCategoryElementForm } from '@/features/student/selfKnowledge/types/forms.types'
import CategoryElementRatingRadioButtonSet from '@/features/student/selfKnowledge/components/interactions/inputs/CategoryElementRatingRadioButtonSet/CategoryElementRatingRadioButtonSet.vue'
import { markRaw } from 'vue'

interface CategoryElementRatingInputFormFieldProps {
  form: AddSelfKnowledgeCategoryElementForm
}

const { form } = defineProps<CategoryElementRatingInputFormFieldProps>()
const FormField = markRaw(form.Field)
</script>

<template>
  <FormField name="rating">
    <template #default="{ field }">
      <CategoryElementRatingRadioButtonSet
        v-bind="$attrs"
        :model-value="field.state.value ?? undefined"
        :error-message="field.state.meta.errors?.join(', ')"
        @blur="field.handleBlur"
        @update:model-value="(value) => typeof value === 'number' && field.handleChange(value)"
      />
    </template>
  </FormField>
</template>
