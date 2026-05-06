<script setup lang="ts">
import type { AddDeclaredExperienceForm, UpdateDeclaredExperienceForm } from '@/features/student/personalCareer/types/forms.types'
import DeclaredExperienceLocationInput from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceLocationInput/DeclaredExperienceLocationInput.vue'
import { markRaw } from 'vue'

interface DeclaredExperienceLocationFormFieldProps {
  form: AddDeclaredExperienceForm | UpdateDeclaredExperienceForm
}

defineOptions({
  inheritAttrs: false
})

const { form } = defineProps<DeclaredExperienceLocationFormFieldProps>()

const emit = defineEmits<{
  (e: 'maxlengthExceeded', value: boolean): void
}>()

const FormField = markRaw(form.Field)
const locationField = form.useField({ name: 'location' })

function onUpdateLocation (value: string | undefined) {
  locationField.api.handleChange(String(value ?? ''))
}

function onMaxlengthExceeded (value: boolean) {
  emit('maxlengthExceeded', value)
}
</script>

<template>
  <FormField name="location">
    <template #default="{ field }">
      <DeclaredExperienceLocationInput
        v-bind="$attrs"
        :model-value="(field.state.value ?? '')"
        :error-message="field.state.meta.errors?.join(', ')"
        @blur="field.handleBlur"
        @update:model-value="onUpdateLocation"
        @maxlength-exceeded="onMaxlengthExceeded"
      />
    </template>
  </FormField>
</template>
