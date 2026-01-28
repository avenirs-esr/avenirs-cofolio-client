<script setup lang="ts">
import type { EExperienceType } from '@/api/avenir-esr'
import type { AddDeclaredExperienceForm, UpdateDeclaredExperienceForm } from '@/features/student/personalCareer/types/forms.types'
import DeclaredExperienceTypeSelect from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceTypeSelect/DeclaredExperienceTypeSelect.vue'
import { markRaw } from 'vue'

interface DeclaredExperienceTypeFormFieldProps {
  form: AddDeclaredExperienceForm | UpdateDeclaredExperienceForm
}

defineOptions({
  inheritAttrs: false
})

const { form } = defineProps<DeclaredExperienceTypeFormFieldProps>()
const FormField = markRaw(form.Field)
const typeField = form.useField({ name: 'type' })

function onUpdateType (value: EExperienceType | undefined) {
  typeField.api.handleChange(value ?? '')
}
</script>

<template>
  <FormField name="type">
    <template #default="{ field }">
      <DeclaredExperienceTypeSelect
        v-bind="$attrs"
        :model-value="field.state.value as EExperienceType"
        :error-message="field.state.meta.errors?.join(', ')"
        @blur="field.handleBlur"
        @update:model-value="onUpdateType"
      />
    </template>
  </FormField>
</template>
