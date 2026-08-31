<script setup lang="ts">
import type { AddDeclaredProgramForm } from '@/features/personalCareer/types/forms.types'
import DeclaredProgramDescriptionTextarea from '@/features/personalCareer/components/interactions/inputs/DeclaredProgramDescriptionTextarea/DeclaredProgramDescriptionTextarea.vue'
import { markRaw } from 'vue'

interface DeclaredProgramDescriptionFormFieldProps {
  form: AddDeclaredProgramForm
}

const { form } = defineProps<DeclaredProgramDescriptionFormFieldProps>()
const FormField = markRaw(form.Field)
const descriptionField = form.useField({ name: 'description' })

function onUpdateDescription (value: string | undefined) {
  descriptionField.api.handleChange(String(value ?? ''))
}
</script>

<template>
  <FormField name="description">
    <template #default="{ field }">
      <DeclaredProgramDescriptionTextarea
        v-bind="$attrs"
        :model-value="field.state.value ?? ''"
        :error-message="field.state.meta.errors?.join(', ')"
        @blur="field.handleBlur"
        @update:model-value="onUpdateDescription"
      />
    </template>
  </FormField>
</template>
