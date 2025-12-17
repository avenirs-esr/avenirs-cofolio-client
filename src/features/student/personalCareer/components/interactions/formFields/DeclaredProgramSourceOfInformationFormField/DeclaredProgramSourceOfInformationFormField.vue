<script setup lang="ts">
import type { AddDeclaredProgramForm } from '@/features/student/personalCareer/types/forms.types'
import DeclaredProgramSourceOfInformationInput from '@/features/student/personalCareer/components/interactions/inputs/DeclaredProgramSourceOfInformationInput/DeclaredProgramSourceOfInformationInput.vue'
import { DECLARED_PROGRAM_SOURCE_OF_INFORMATION_MAX_LENGTH } from '@/features/student/personalCareer/config'
import { markRaw } from 'vue'

interface DeclaredProgramSourceOfInformationFormFieldProps {
  form: AddDeclaredProgramForm
}

defineOptions({
  inheritAttrs: false
})

const { form } = defineProps<DeclaredProgramSourceOfInformationFormFieldProps>()
const FormField = markRaw(form.Field)
const sourceOfInformationField = form.useField({ name: 'sourceOfInformation' })

function onUpdateSourceOfInformation (value: string | undefined) {
  sourceOfInformationField.api.handleChange(String(value ?? '').slice(0, DECLARED_PROGRAM_SOURCE_OF_INFORMATION_MAX_LENGTH))
}
</script>

<template>
  <FormField name="sourceOfInformation">
    <template #default="{ field }">
      <DeclaredProgramSourceOfInformationInput
        v-bind="$attrs"
        :model-value="(field.state.value ?? '').slice(0, DECLARED_PROGRAM_SOURCE_OF_INFORMATION_MAX_LENGTH)"
        :error-message="field.state.meta.errors?.join(', ')"
        @blur="field.handleBlur"
        @update:model-value="onUpdateSourceOfInformation"
      />
    </template>
  </FormField>
</template>
