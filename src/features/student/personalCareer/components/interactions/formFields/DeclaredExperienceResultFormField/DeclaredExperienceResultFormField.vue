<script setup lang="ts">
import type { AddDeclaredExperienceForm, UpdateDeclaredExperienceForm } from '@/features/student/personalCareer/types/forms.types'
import { markRaw } from 'vue'
import DeclaredExperienceResultInput from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceResultInput/DeclaredExperienceResultInput.vue'

interface DeclaredExperienceResultFormFieldProps {
  form: AddDeclaredExperienceForm | UpdateDeclaredExperienceForm
}

const { form } = defineProps<DeclaredExperienceResultFormFieldProps>()
const FormField = markRaw(form.Field)
const resultField = form.useField({ name: 'result' })

function onUpdateResult (value: string | undefined) {
  resultField.api.handleChange(String(value ?? ''))
}
</script>

<template>
  <FormField name="result">
    <template #default="{ field }">
      <DeclaredExperienceResultInput
        v-bind="$attrs"
        :model-value="field.state.value ?? ''"
        :error-message="field.state.meta.errors?.join(', ')"
        @blur="field.handleBlur"
        @update:model-value="onUpdateResult"
      />
    </template>
  </FormField>
</template>
