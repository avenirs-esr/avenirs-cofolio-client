<script setup lang="ts">
import type { AddDeclaredExperienceForm } from '@/features/student/personalCareer/types/forms.types'
import DeclaredExperienceSourceOfInformationInput from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceSourceOfInformationInput/DeclaredExperienceSourceOfInformationInput.vue'
import { DECLARED_EXPERIENCE_SOURCE_OF_INFORMATION_MAX_LENGTH } from '@/features/student/personalCareer/config'
import { markRaw } from 'vue'

interface DeclaredExperienceSourceOfInformationFormFieldProps {
  form: AddDeclaredExperienceForm
}

defineOptions({
  inheritAttrs: false
})

const { form } = defineProps<DeclaredExperienceSourceOfInformationFormFieldProps>()
const FormField = markRaw(form.Field)
const sourceOfInformationField = form.useField({ name: 'sourceOfInformation' })

function onUpdateSourceOfInformation (value: string | undefined) {
  sourceOfInformationField.api.handleChange(String(value ?? '').slice(0, DECLARED_EXPERIENCE_SOURCE_OF_INFORMATION_MAX_LENGTH))
}
</script>

<template>
  <FormField name="sourceOfInformation">
    <template #default="{ field }">
      <DeclaredExperienceSourceOfInformationInput
        v-bind="$attrs"
        :model-value="(field.state.value ?? '').slice(0, DECLARED_EXPERIENCE_SOURCE_OF_INFORMATION_MAX_LENGTH)"
        :error-message="field.state.meta.errors?.join(', ')"
        @blur="field.handleBlur"
        @update:model-value="onUpdateSourceOfInformation"
      />
    </template>
  </FormField>
</template>
