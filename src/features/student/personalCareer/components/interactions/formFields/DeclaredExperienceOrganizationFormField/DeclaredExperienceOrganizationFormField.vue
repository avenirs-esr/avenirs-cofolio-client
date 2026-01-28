<script setup lang="ts">
import type { AddDeclaredExperienceForm, UpdateDeclaredExperienceForm } from '@/features/student/personalCareer/types/forms.types'
import DeclaredExperienceOrganizationInput from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceOrganizationInput/DeclaredExperienceOrganizationInput.vue'
import { DECLARED_EXPERIENCE_ORGANIZATION_MAX_LENGTH } from '@/features/student/personalCareer/config'
import { markRaw } from 'vue'

interface DeclaredExperienceOrganizationFormFieldProps {
  form: AddDeclaredExperienceForm | UpdateDeclaredExperienceForm
}

defineOptions({
  inheritAttrs: false
})

const { form } = defineProps<DeclaredExperienceOrganizationFormFieldProps>()
const FormField = markRaw(form.Field)
const organizationField = form.useField({ name: 'organization' })

function onUpdateOrganization (value: string | undefined) {
  organizationField.api.handleChange(String(value ?? '').slice(0, DECLARED_EXPERIENCE_ORGANIZATION_MAX_LENGTH))
}
</script>

<template>
  <FormField name="organization">
    <template #default="{ field }">
      <DeclaredExperienceOrganizationInput
        v-bind="$attrs"
        :model-value="(field.state.value ?? '').slice(0, DECLARED_EXPERIENCE_ORGANIZATION_MAX_LENGTH)"
        :error-message="field.state.meta.errors?.join(', ')"
        @blur="field.handleBlur"
        @update:model-value="onUpdateOrganization"
      />
    </template>
  </FormField>
</template>
