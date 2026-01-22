<script setup lang="ts">
import type { AddDeclaredExperienceForm } from '@/features/student/personalCareer/types/forms.types'
import DeclaredExperienceLocationInput from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceLocationInput/DeclaredExperienceLocationInput.vue'
import { DECLARED_EXPERIENCE_LOCATION_MAX_LENGTH } from '@/features/student/personalCareer/config'
import { markRaw } from 'vue'

interface DeclaredExperienceLocationFormFieldProps {
  form: AddDeclaredExperienceForm
}

defineOptions({
  inheritAttrs: false
})

const { form } = defineProps<DeclaredExperienceLocationFormFieldProps>()
const FormField = markRaw(form.Field)
const locationField = form.useField({ name: 'location' })

function onUpdateLocation (value: string | undefined) {
  locationField.api.handleChange(String(value ?? '').slice(0, DECLARED_EXPERIENCE_LOCATION_MAX_LENGTH))
}
</script>

<template>
  <FormField name="location">
    <template #default="{ field }">
      <DeclaredExperienceLocationInput
        v-bind="$attrs"
        :model-value="(field.state.value ?? '').slice(0, DECLARED_EXPERIENCE_LOCATION_MAX_LENGTH)"
        :error-message="field.state.meta.errors?.join(', ')"
        @blur="field.handleBlur"
        @update:model-value="onUpdateLocation"
      />
    </template>
  </FormField>
</template>
