<script setup lang="ts">
import type { AddDeclaredProgramForm } from '@/features/student/personalCareer/types/forms.types'
import DeclaredProgramResultInput from '@/features/student/personalCareer/components/interactions/inputs/DeclaredProgramResultInput/DeclaredProgramResultInput.vue'
import { DECLARED_PROGRAM_RESULT_MAX_LENGTH } from '@/features/student/personalCareer/config'
import { markRaw } from 'vue'

interface DeclaredProgramResultFormFieldProps {
  form: AddDeclaredProgramForm
}

defineOptions({
  inheritAttrs: false
})

const { form } = defineProps<DeclaredProgramResultFormFieldProps>()
const FormField = markRaw(form.Field)
const resultField = form.useField({ name: 'result' })

function onUpdateResult (value: string | undefined) {
  resultField.api.handleChange(String(value ?? '').slice(0, DECLARED_PROGRAM_RESULT_MAX_LENGTH))
}
</script>

<template>
  <FormField name="result">
    <template #default="{ field }">
      <DeclaredProgramResultInput
        v-bind="$attrs"
        :model-value="(field.state.value ?? '').slice(0, DECLARED_PROGRAM_RESULT_MAX_LENGTH)"
        :error-message="field.state.meta.errors?.join(', ')"
        @blur="field.handleBlur"
        @update:model-value="onUpdateResult"
      />
    </template>
  </FormField>
</template>
