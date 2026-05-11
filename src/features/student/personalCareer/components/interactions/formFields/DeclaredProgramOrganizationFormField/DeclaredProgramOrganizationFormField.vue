<script setup lang="ts">
import type { AddDeclaredProgramForm } from '@/features/student/personalCareer/types/forms.types'
import DeclaredProgramOrganizationInput from '@/features/student/personalCareer/components/interactions/inputs/DeclaredProgramOrganizationInput/DeclaredProgramOrganizationInput.vue'
import { markRaw } from 'vue'

interface DeclaredProgramInstitutionFormFieldProps {
  form: AddDeclaredProgramForm
}

const { form } = defineProps<DeclaredProgramInstitutionFormFieldProps>()
const FormField = markRaw(form.Field)
const institutionField = form.useField({ name: 'organization' })

function onUpdateInstitution (value: string | undefined) {
  institutionField.api.handleChange(String(value ?? ''))
}
</script>

<template>
  <FormField name="organization">
    <template #default="{ field }">
      <DeclaredProgramOrganizationInput
        v-bind="$attrs"
        :model-value="field.state.value ?? ''"
        :error-message="field.state.meta.errors?.join(', ')"
        required
        @blur="field.handleBlur"
        @update:model-value="onUpdateInstitution"
      />
    </template>
  </FormField>
</template>
