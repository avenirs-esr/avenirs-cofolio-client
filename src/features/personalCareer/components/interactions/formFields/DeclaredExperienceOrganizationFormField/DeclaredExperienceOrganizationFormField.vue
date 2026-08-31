<script setup lang="ts">
import type { AddDeclaredExperienceForm, UpdateDeclaredExperienceForm } from '@/features/personalCareer/types/forms.types'
import DeclaredExperienceOrganizationInput from '@/features/personalCareer/components/interactions/inputs/DeclaredExperienceOrganizationInput/DeclaredExperienceOrganizationInput.vue'
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
  organizationField.api.handleChange(String(value ?? ''))
}
</script>

<template>
  <FormField name="organization">
    <template #default="{ field }">
      <DeclaredExperienceOrganizationInput
        v-bind="$attrs"
        :model-value="(field.state.value ?? '')"
        :error-message="field.state.meta.errors?.join(', ')"
        required
        @blur="field.handleBlur"
        @update:model-value="onUpdateOrganization"
      />
    </template>
  </FormField>
</template>
