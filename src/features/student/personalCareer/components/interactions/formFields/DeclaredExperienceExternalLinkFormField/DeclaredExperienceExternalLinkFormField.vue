<script setup lang="ts">
import type { AddDeclaredExperienceForm, UpdateDeclaredExperienceForm } from '@/features/student/personalCareer/types/forms.types'
import DeclaredExperienceExternalLinkInput from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceExternalLinkInput/DeclaredExperienceExternalLinkInput.vue'
import { markRaw } from 'vue'

interface DeclaredExperienceExternalLinkFormFieldProps {
  form: AddDeclaredExperienceForm | UpdateDeclaredExperienceForm
}

defineOptions({
  inheritAttrs: false
})

const { form } = defineProps<DeclaredExperienceExternalLinkFormFieldProps>()

const emit = defineEmits<{
  (e: 'maxlengthExceeded', value: boolean): void
}>()

const FormField = markRaw(form.Field)
const externalLinkField = form.useField({ name: 'externalLink' })

function onUpdateExternalLink (value: string | undefined) {
  externalLinkField.api.handleChange(String(value ?? ''))
}

function onMaxlengthExceeded (value: boolean) {
  emit('maxlengthExceeded', value)
}
</script>

<template>
  <FormField name="externalLink">
    <template #default="{ field }">
      <DeclaredExperienceExternalLinkInput
        v-bind="$attrs"
        :model-value="(field.state.value ?? '')"
        :error-message="field.state.meta.errors?.join(', ')"
        @blur="field.handleBlur"
        @update:model-value="onUpdateExternalLink"
        @maxlength-exceeded="onMaxlengthExceeded"
      />
    </template>
  </FormField>
</template>
