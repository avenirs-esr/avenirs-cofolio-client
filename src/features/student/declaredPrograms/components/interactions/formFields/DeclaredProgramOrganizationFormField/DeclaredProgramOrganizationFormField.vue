<script setup lang="ts">
import type { AddDeclaredProgramForm } from '@/features/student/declaredPrograms/types/forms.types'
import DeclaredProgramOrganizationInput from '@/features/student/declaredPrograms/components/interactions/inputs/DeclaredProgramOrganizationInput/DeclaredProgramOrganizationInput.vue'
import { DECLARED_PROGRAM_ORGANIZATION_MAX_LENGTH } from '@/features/student/declaredPrograms/config'
import { markRaw } from 'vue'

interface DeclaredProgramInstitutionFormFieldProps {
  form: AddDeclaredProgramForm
}

defineOptions({
  inheritAttrs: false
})

const { form } = defineProps<DeclaredProgramInstitutionFormFieldProps>()
const FormField = markRaw(form.Field)
const institutionField = form.useField({ name: 'organization' })

function onUpdateInstitution (value: string | undefined) {
  institutionField.api.handleChange(String(value ?? '').slice(0, DECLARED_PROGRAM_ORGANIZATION_MAX_LENGTH))
}
</script>

<template>
  <FormField name="organization">
    <template #default="{ field }">
      <DeclaredProgramOrganizationInput
        v-bind="$attrs"
        :model-value="(field.state.value ?? '').slice(0, DECLARED_PROGRAM_ORGANIZATION_MAX_LENGTH)"
        :error-message="field.state.meta.errors?.join(', ')"
        @blur="field.handleBlur"
        @update:model-value="onUpdateInstitution"
      />
    </template>
  </FormField>
</template>
