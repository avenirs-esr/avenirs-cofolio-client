<script setup lang="ts">
import type { AddDeclaredExperienceForm, UpdateDeclaredExperienceForm } from '@/features/personalCareer/types/forms.types'
import DeclaredExperienceDescriptionTextarea from '@/features/personalCareer/components/interactions/inputs/DeclaredExperienceDescriptionTextarea/DeclaredExperienceDescriptionTextarea.vue'
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
  descriptionField.api.handleChange(String(value ?? ''))
}
</script>

<template>
  <FormField name="description">
    <template #default="{ field }">
      <DeclaredExperienceDescriptionTextarea
        v-bind="$attrs"
        :model-value="(field.state.value ?? '')"
        :error-message="field.state.meta.errors?.join(', ')"
        @blur="field.handleBlur"
        @update:model-value="onUpdateDescription"
      />
    </template>
  </FormField>
</template>
