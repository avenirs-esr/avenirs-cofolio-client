<script setup lang="ts">
import type { AddDeclaredExperienceForm } from '@/features/student/personalCareer/types/forms.types'
import DeclaredExperienceActivitySectorInput from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceActivitySectorInput/DeclaredExperienceActivitySectorInput.vue'
import { DECLARED_EXPERIENCE_ACTIVITY_SECTOR_MAX_LENGTH } from '@/features/student/personalCareer/config'
import { markRaw } from 'vue'

interface DeclaredExperienceActivitySectorFormFieldProps {
  form: AddDeclaredExperienceForm
}

defineOptions({
  inheritAttrs: false
})

const { form } = defineProps<DeclaredExperienceActivitySectorFormFieldProps>()
const FormField = markRaw(form.Field)
const activitySectorField = form.useField({ name: 'activitySector' })

function onUpdateActivitySector (value: string | undefined) {
  activitySectorField.api.handleChange(String(value ?? '').slice(0, DECLARED_EXPERIENCE_ACTIVITY_SECTOR_MAX_LENGTH))
}
</script>

<template>
  <FormField name="activitySector">
    <template #default="{ field }">
      <DeclaredExperienceActivitySectorInput
        v-bind="$attrs"
        :model-value="(field.state.value ?? '').slice(0, DECLARED_EXPERIENCE_ACTIVITY_SECTOR_MAX_LENGTH)"
        :error-message="field.state.meta.errors?.join(', ')"
        @blur="field.handleBlur"
        @update:model-value="onUpdateActivitySector"
      />
    </template>
  </FormField>
</template>
