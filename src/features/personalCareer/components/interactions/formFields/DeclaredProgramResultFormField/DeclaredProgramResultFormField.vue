<script setup lang="ts">
import type { AddDeclaredProgramForm } from '@/features/personalCareer/types/forms.types'
import DeclaredProgramResultInput from '@/features/personalCareer/components/interactions/inputs/DeclaredProgramResultInput/DeclaredProgramResultInput.vue'
import { markRaw } from 'vue'

interface DeclaredProgramResultFormFieldProps {
  form: AddDeclaredProgramForm
}

const { form } = defineProps<DeclaredProgramResultFormFieldProps>()
const FormField = markRaw(form.Field)
const resultField = form.useField({ name: 'result' })

function onUpdateResult (value: string | undefined) {
  resultField.api.handleChange(String(value ?? ''))
}
</script>

<template>
  <FormField name="result">
    <template #default="{ field }">
      <DeclaredProgramResultInput
        v-bind="$attrs"
        :model-value="field.state.value ?? ''"
        :error-message="field.state.meta.errors?.join(', ')"
        @blur="field.handleBlur"
        @update:model-value="onUpdateResult"
      />
    </template>
  </FormField>
</template>
