<script setup lang="ts">
import type { AddSelfKnowledgeCategoryElementForm } from '@/features/student/selfKnowledge/types/forms.types'
import CategoryElementTitleInput from '@/features/student/selfKnowledge/components/interactions/inputs/CategoryElementTitleInput/CategoryElementTitleInput.vue'
import { markRaw } from 'vue'

interface CategoryElementTitleInputFormFieldProps {
  form: AddSelfKnowledgeCategoryElementForm
}

const { form } = defineProps<CategoryElementTitleInputFormFieldProps>()
const FormField = markRaw(form.Field)
const titleField = form.useField({ name: 'title' })

function onUpdateModelValue (value: string | undefined) {
  if (typeof value === 'string') {
    titleField.api.handleChange(value)
  }
  else {
    titleField.api.handleChange('')
  }
}
</script>

<template>
  <FormField name="title">
    <template #default="{ field }">
      <CategoryElementTitleInput
        v-bind="$attrs"
        id="element-title"
        v-model="field.state.value"
        :error-message="field.state.meta.errors?.join(', ')"
        required
        @blur="field.handleBlur"
        @update:model-value="onUpdateModelValue"
      />
    </template>
  </FormField>
</template>
