<script setup lang="ts">
import type {
  AddSelfKnowledgeCategoryElementForm,
  UpdateSelfKnowledgeCategoryElementForm
} from '@/features/selfKnowledge/types/forms.types'
import CategoryElementDescriptionTextarea from '@/features/selfKnowledge/components/interactions/inputs/CategoryElementDescriptionTextarea/CategoryElementDescriptionTextarea.vue'
import { markRaw } from 'vue'

interface CategoryElementDescriptionTextareaFormFieldProps {
  form: AddSelfKnowledgeCategoryElementForm | UpdateSelfKnowledgeCategoryElementForm
}

const { form } = defineProps<CategoryElementDescriptionTextareaFormFieldProps>()
const FormField = markRaw(form.Field)
const descriptionField = form.useField({ name: 'description' })

function onUpdateModelValue (value: string | undefined) {
  if (typeof value === 'string') {
    descriptionField.api.handleChange(value)
  }
  else {
    descriptionField.api.handleChange('')
  }
}
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
        @update:model-value="onUpdateModelValue"
      />
    </template>
  </FormField>
</template>
