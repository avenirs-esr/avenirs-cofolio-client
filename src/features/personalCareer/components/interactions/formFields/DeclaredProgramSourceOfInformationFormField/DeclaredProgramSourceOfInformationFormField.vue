<script setup lang="ts">
import type { AddDeclaredProgramForm } from '@/features/personalCareer/types/forms.types'
import DeclaredProgramSourceOfInformationInput from '@/features/personalCareer/components/interactions/inputs/DeclaredProgramSourceOfInformationInput/DeclaredProgramSourceOfInformationInput.vue'
import { markRaw } from 'vue'

interface DeclaredProgramSourceOfInformationFormFieldProps {
  form: AddDeclaredProgramForm
}

const { form } = defineProps<DeclaredProgramSourceOfInformationFormFieldProps>()
const FormField = markRaw(form.Field)
const sourceOfInformationField = form.useField({ name: 'sourceOfInformation' })

function onUpdateSourceOfInformation (value: string | undefined) {
  sourceOfInformationField.api.handleChange(String(value ?? ''))
}
</script>

<template>
  <FormField name="sourceOfInformation">
    <template #default="{ field }">
      <DeclaredProgramSourceOfInformationInput
        v-bind="$attrs"
        :model-value="field.state.value ?? ''"
        :error-message="field.state.meta.errors?.join(', ')"
        @blur="field.handleBlur"
        @update:model-value="onUpdateSourceOfInformation"
      />
    </template>
  </FormField>
</template>
