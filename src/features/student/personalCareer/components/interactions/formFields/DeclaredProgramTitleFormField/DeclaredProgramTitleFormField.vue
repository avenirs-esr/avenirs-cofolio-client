<script setup lang="ts">
import type { AddDeclaredProgramForm } from '@/features/student/personalCareer/types/forms.types'
import DeclaredProgramTitleInput from '@/features/student/personalCareer/components/interactions/inputs/DeclaredProgramTitleInput/DeclaredProgramTitleInput.vue'
import { DECLARED_PROGRAM_TITLE_MAX_LENGTH } from '@/features/student/personalCareer/config'
import { markRaw } from 'vue'

interface DeclaredProgramTitleFormFieldProps {
  form: AddDeclaredProgramForm
}

defineOptions({
  inheritAttrs: false
})

const { form } = defineProps<DeclaredProgramTitleFormFieldProps>()
const FormField = markRaw(form.Field)
const titleField = form.useField({ name: 'title' })

function onUpdateTitle (value: string | undefined) {
  titleField.api.handleChange(String(value ?? '').slice(0, DECLARED_PROGRAM_TITLE_MAX_LENGTH))
}
</script>

<template>
  <FormField name="title">
    <template #default="{ field }">
      <DeclaredProgramTitleInput
        v-bind="$attrs"
        :model-value="(field.state.value ?? '').slice(0, DECLARED_PROGRAM_TITLE_MAX_LENGTH)"
        :error-message="field.state.meta.errors?.join(', ')"
        @blur="field.handleBlur"
        @update:model-value="onUpdateTitle"
      />
    </template>
  </FormField>
</template>
