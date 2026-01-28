<script setup lang="ts">
import type { AddDeclaredExperienceForm, UpdateDeclaredExperienceForm } from '@/features/student/personalCareer/types/forms.types'
import DeclaredExperienceExternalLinkInput from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceExternalLinkInput/DeclaredExperienceExternalLinkInput.vue'
import { DECLARED_EXPERIENCE_EXTERNAL_LINK_MAX_LENGTH } from '@/features/student/personalCareer/config'
import { markRaw } from 'vue'

interface DeclaredExperienceExternalLinkFormFieldProps {
  form: AddDeclaredExperienceForm | UpdateDeclaredExperienceForm
}

defineOptions({
  inheritAttrs: false
})

const { form } = defineProps<DeclaredExperienceExternalLinkFormFieldProps>()
const FormField = markRaw(form.Field)
const externalLinkField = form.useField({ name: 'externalLink' })

function onUpdateExternalLink (value: string | undefined) {
  externalLinkField.api.handleChange(String(value ?? '').slice(0, DECLARED_EXPERIENCE_EXTERNAL_LINK_MAX_LENGTH))
}
</script>

<template>
  <FormField name="externalLink">
    <template #default="{ field }">
      <DeclaredExperienceExternalLinkInput
        v-bind="$attrs"
        :model-value="(field.state.value ?? '').slice(0, DECLARED_EXPERIENCE_EXTERNAL_LINK_MAX_LENGTH)"
        :error-message="field.state.meta.errors?.join(', ')"
        @blur="field.handleBlur"
        @update:model-value="onUpdateExternalLink"
      />
    </template>
  </FormField>
</template>
