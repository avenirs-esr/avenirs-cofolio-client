<script setup lang="ts">
import type { AddSelfKnowledgeCategoryElementForm } from '@/features/student/selfKnowledge/types/forms.types'
import CategoryElementTitleInput from '@/features/student/selfKnowledge/components/interactions/inputs/CategoryElementTitleInput/CategoryElementTitleInput.vue'
import { markRaw } from 'vue'

interface CategoryElementTitleInputFormFieldProps {
  form: AddSelfKnowledgeCategoryElementForm
}

const { form } = defineProps<CategoryElementTitleInputFormFieldProps>()
const FormField = markRaw(form.Field)
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
        @update:model-value="(value) => typeof value == 'string' && field.handleChange(value)"
      />
    </template>
  </FormField>
</template>
