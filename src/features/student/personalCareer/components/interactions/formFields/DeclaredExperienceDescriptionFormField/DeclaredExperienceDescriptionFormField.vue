<script setup lang="ts">
import type { AddDeclaredExperienceForm, UpdateDeclaredExperienceForm } from '@/features/student/personalCareer/types/forms.types'
import DeclaredExperienceDescriptionTextarea from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceDescriptionTextarea/DeclaredExperienceDescriptionTextarea.vue'
import { DECLARED_EXPERIENCE_DESCRIPTION_MAX_LENGTH } from '@/features/student/personalCareer/config'
import { markRaw } from 'vue'

interface DeclaredExperienceDescriptionFormFieldProps {
  form: AddDeclaredExperienceForm | UpdateDeclaredExperienceForm
}

defineOptions({
  inheritAttrs: false
})

const { form } = defineProps<DeclaredExperienceDescriptionFormFieldProps>()
const FormField = markRaw(form.Field)
const descriptionField = form.useField({ name: 'description' })

function onUpdateDescription (value: string | undefined) {
  descriptionField.api.handleChange(String(value ?? '').slice(0, DECLARED_EXPERIENCE_DESCRIPTION_MAX_LENGTH))
}
</script>

<template>
  <FormField name="description">
    <template #default="{ field }">
      <DeclaredExperienceDescriptionTextarea
        v-bind="$attrs"
        :model-value="(field.state.value ?? '').slice(0, DECLARED_EXPERIENCE_DESCRIPTION_MAX_LENGTH)"
        :error-message="field.state.meta.errors?.join(', ')"
        @blur="field.handleBlur"
        @update:model-value="onUpdateDescription"
      />
    </template>
  </FormField>
</template>
