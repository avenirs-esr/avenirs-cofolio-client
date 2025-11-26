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
        v-model="field.state.value"
        :error-message="field.state.meta.errors?.join(', ')"
        @blur="field.handleBlur"
        @update:model-value="(value) => field.handleChange(value)"
      />
    </template>
  </FormField>
</template>
