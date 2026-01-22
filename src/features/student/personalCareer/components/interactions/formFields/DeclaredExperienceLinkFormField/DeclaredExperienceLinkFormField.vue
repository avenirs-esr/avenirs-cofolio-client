<script setup lang="ts">
import type { AddDeclaredExperienceForm } from '@/features/student/personalCareer/types/forms.types'
import DeclaredExperienceLinkInput from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceLinkInput/DeclaredExperienceLinkInput.vue'
import { DECLARED_EXPERIENCE_LINK_MAX_LENGTH } from '@/features/student/personalCareer/config'
import { markRaw } from 'vue'

interface DeclaredExperienceLinkFormFieldProps {
  form: AddDeclaredExperienceForm
}

defineOptions({
  inheritAttrs: false
})

const { form } = defineProps<DeclaredExperienceLinkFormFieldProps>()
const FormField = markRaw(form.Field)
const linkField = form.useField({ name: 'link' })

function onUpdateLink (value: string | undefined) {
  linkField.api.handleChange(String(value ?? '').slice(0, DECLARED_EXPERIENCE_LINK_MAX_LENGTH))
}
</script>

<template>
  <FormField name="link">
    <template #default="{ field }">
      <DeclaredExperienceLinkInput
        v-bind="$attrs"
        :model-value="(field.state.value ?? '').slice(0, DECLARED_EXPERIENCE_LINK_MAX_LENGTH)"
        :error-message="field.state.meta.errors?.join(', ')"
        @blur="field.handleBlur"
        @update:model-value="onUpdateLink"
      />
    </template>
  </FormField>
</template>
