<script setup lang="ts">
import type { AddDeclaredExperienceForm, UpdateDeclaredExperienceForm } from '@/features/student/personalCareer/types/forms.types'
import DeclaredExperienceTitleInput from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceTitleInput/DeclaredExperienceTitleInput.vue'
import { markRaw } from 'vue'

interface DeclaredExperienceTitleFormFieldProps {
  form: AddDeclaredExperienceForm | UpdateDeclaredExperienceForm
}

defineOptions({
  inheritAttrs: false
})

const { form } = defineProps<DeclaredExperienceTitleFormFieldProps>()

const FormField = markRaw(form.Field)
const titleField = form.useField({ name: 'title' })

function onUpdateTitle (value: string | undefined) {
  titleField.api.handleChange(String(value ?? ''))
}
</script>

<template>
  <FormField name="title">
    <template #default="{ field }">
      <DeclaredExperienceTitleInput
        v-bind="$attrs"
        :model-value="(field.state.value ?? '')"
        :error-message="field.state.meta.errors?.join(', ')"
        required
        @blur="field.handleBlur"
        @update:model-value="onUpdateTitle"
      />
    </template>
  </FormField>
</template>
