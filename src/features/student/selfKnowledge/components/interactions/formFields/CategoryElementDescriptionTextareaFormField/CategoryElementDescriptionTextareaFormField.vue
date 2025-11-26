<script setup lang="ts">
import type { AddSelfKnowledgeCategoryElementForm } from '@/features/student/selfKnowledge/types/forms.types'
import CategoryElementDescriptionTextarea from '@/features/student/selfKnowledge/components/interactions/inputs/CategoryElementDescriptionTextarea/CategoryElementDescriptionTextarea.vue'
import { markRaw } from 'vue'

interface CategoryElementDescriptionTextareaFormFieldProps {
  form: AddSelfKnowledgeCategoryElementForm
}

const { form } = defineProps<CategoryElementDescriptionTextareaFormFieldProps>()
const FormField = markRaw(form.Field)
</script>

<template>
  <FormField name="description">
    <template #default="{ field }">
      <CategoryElementDescriptionTextarea
        v-bind="$attrs"
        id="element-description"
        v-model="field.state.value"
        :error-message="field.state.meta.errors?.join(', ')"
        @blur="field.handleBlur"
        @update:model-value="(value) => typeof value == 'string' ? field.handleChange(value) : field.handleChange('')"
      />
    </template>
  </FormField>
</template>
