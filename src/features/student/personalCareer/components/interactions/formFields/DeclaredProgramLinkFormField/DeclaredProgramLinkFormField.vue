<script setup lang="ts">
import type { AddDeclaredProgramForm } from '@/features/student/personalCareer/types/forms.types'
import DeclaredProgramLinkInput from '@/features/student/personalCareer/components/interactions/inputs/DeclaredProgramLinkInput/DeclaredProgramLinkInput.vue'
import { markRaw } from 'vue'

interface DeclaredProgramLinkFormFieldProps {
  form: AddDeclaredProgramForm
}

defineOptions({
  inheritAttrs: false
})

const { form } = defineProps<DeclaredProgramLinkFormFieldProps>()
const FormField = markRaw(form.Field)
const linkField = form.useField({ name: 'link' })

function onUpdateLink (value: string | undefined) {
  linkField.api.handleChange(String(value ?? ''))
}
</script>

<template>
  <FormField name="link">
    <template #default="{ field }">
      <DeclaredProgramLinkInput
        v-bind="$attrs"
        :model-value="field.state.value"
        :error-message="field.state.meta.errors?.join(', ')"
        @blur="field.handleBlur"
        @update:model-value="onUpdateLink"
      />
    </template>
  </FormField>
</template>
