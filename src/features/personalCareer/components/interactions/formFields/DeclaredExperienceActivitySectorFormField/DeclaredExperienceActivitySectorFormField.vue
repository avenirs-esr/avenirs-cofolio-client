<script setup lang="ts">
import type { AddDeclaredExperienceForm, UpdateDeclaredExperienceForm } from '@/features/personalCareer/types/forms.types'
import DeclaredExperienceActivitySectorInput from '@/features/personalCareer/components/interactions/inputs/DeclaredExperienceActivitySectorInput/DeclaredExperienceActivitySectorInput.vue'
import { markRaw } from 'vue'

interface DeclaredExperienceActivitySectorFormFieldProps {
  form: AddDeclaredExperienceForm | UpdateDeclaredExperienceForm
}

defineOptions({
  inheritAttrs: false
})

const { form } = defineProps<DeclaredExperienceActivitySectorFormFieldProps>()

const FormField = markRaw(form.Field)
const activitySectorField = form.useField({ name: 'activitySector' })

function onUpdateActivitySector (value: string | undefined) {
  activitySectorField.api.handleChange(String(value ?? ''))
}
</script>

<template>
  <FormField name="activitySector">
    <template #default="{ field }">
      <DeclaredExperienceActivitySectorInput
        v-bind="$attrs"
        :model-value="(field.state.value ?? '')"
        :error-message="field.state.meta.errors?.join(', ')"
        @blur="field.handleBlur"
        @update:model-value="onUpdateActivitySector"
      />
    </template>
  </FormField>
</template>
