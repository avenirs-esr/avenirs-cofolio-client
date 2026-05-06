<script setup lang="ts">
import type { AddDeclaredExperienceForm, UpdateDeclaredExperienceForm } from '@/features/student/personalCareer/types/forms.types'
import DeclaredExperienceOrganizationInput from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceOrganizationInput/DeclaredExperienceOrganizationInput.vue'
import { markRaw } from 'vue'

interface DeclaredExperienceOrganizationFormFieldProps {
  form: AddDeclaredExperienceForm | UpdateDeclaredExperienceForm
}

defineOptions({
  inheritAttrs: false
})

const { form } = defineProps<DeclaredExperienceOrganizationFormFieldProps>()

const emit = defineEmits<{
  (e: 'maxlengthExceeded', value: boolean): void
}>()

const FormField = markRaw(form.Field)
const organizationField = form.useField({ name: 'organization' })

function onUpdateOrganization (value: string | undefined) {
  organizationField.api.handleChange(String(value ?? ''))
}

function onMaxlengthExceeded (value: boolean) {
  emit('maxlengthExceeded', value)
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
        @maxlength-exceeded="onMaxlengthExceeded"
        @update:model-value="onUpdateOrganization"
      />
    </template>
  </FormField>
</template>
