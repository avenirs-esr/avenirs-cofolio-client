<script setup lang="ts">
import type { AddDeclaredExperienceForm, UpdateDeclaredExperienceForm } from '@/features/student/personalCareer/types/forms.types'
import DeclaredExperienceSourceOfInformationInput from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceSourceOfInformationInput/DeclaredExperienceSourceOfInformationInput.vue'
import { markRaw } from 'vue'

interface DeclaredExperienceSourceOfInformationFormFieldProps {
  form: AddDeclaredExperienceForm | UpdateDeclaredExperienceForm
}

defineOptions({
  inheritAttrs: false
})

const { form } = defineProps<DeclaredExperienceSourceOfInformationFormFieldProps>()

const emit = defineEmits<{
  (e: 'maxlengthExceeded', value: boolean): void
}>()

const FormField = markRaw(form.Field)
const sourceOfInformationField = form.useField({ name: 'sourceOfInformation' })

function onUpdateSourceOfInformation (value: string | undefined) {
  sourceOfInformationField.api.handleChange(String(value ?? ''))
}

function onMaxlengthExceeded (value: boolean) {
  emit('maxlengthExceeded', value)
}
</script>

<template>
  <FormField name="sourceOfInformation">
    <template #default="{ field }">
      <DeclaredExperienceSourceOfInformationInput
        v-bind="$attrs"
        :model-value="(field.state.value ?? '')"
        :error-message="field.state.meta.errors?.join(', ')"
        @blur="field.handleBlur"
        @update:model-value="onUpdateSourceOfInformation"
        @maxlength-exceeded="onMaxlengthExceeded"
      />
    </template>
  </FormField>
</template>
