<script setup lang="ts">
import type { AddDeclaredProgramForm } from '@/features/student/personalCareer/types/forms.types'
import DeclaredProgramTitleInput from '@/features/student/personalCareer/components/interactions/inputs/DeclaredProgramTitleInput/DeclaredProgramTitleInput.vue'
import { markRaw } from 'vue'

interface DeclaredProgramTitleFormFieldProps {
  form: AddDeclaredProgramForm
}

const { form } = defineProps<DeclaredProgramTitleFormFieldProps>()
const FormField = markRaw(form.Field)
const titleField = form.useField({ name: 'title' })

function onUpdateTitle (value: string | undefined) {
  titleField.api.handleChange(String(value ?? ''))
}
</script>

<template>
  <FormField name="title">
    <template #default="{ field }">
      <DeclaredProgramTitleInput
        v-bind="$attrs"
        :model-value="field.state.value ?? ''"
        :error-message="field.state.meta.errors?.join(', ')"
        required
        @blur="field.handleBlur"
        @update:model-value="onUpdateTitle"
      />
    </template>
  </FormField>
</template>
