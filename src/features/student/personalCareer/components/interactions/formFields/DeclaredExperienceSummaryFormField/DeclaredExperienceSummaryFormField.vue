<script setup lang="ts">
import type { AddDeclaredExperienceForm, UpdateDeclaredExperienceForm } from '@/features/student/personalCareer/types/forms.types'
import DeclaredExperienceSummaryTextarea from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceSummaryTextarea/DeclaredExperienceSummaryTextarea.vue'
import { DECLARED_EXPERIENCE_SUMMARY_MAX_LENGTH } from '@/features/student/personalCareer/config'
import { markRaw } from 'vue'

interface DeclaredExperienceSummaryFormFieldProps {
  form: AddDeclaredExperienceForm | UpdateDeclaredExperienceForm
}

defineOptions({
  inheritAttrs: false
})

const { form } = defineProps<DeclaredExperienceSummaryFormFieldProps>()
const FormField = markRaw(form.Field)
const summaryField = form.useField({ name: 'summary' })

function onUpdateSummary (value: string | undefined) {
  summaryField.api.handleChange(String(value ?? '').slice(0, DECLARED_EXPERIENCE_SUMMARY_MAX_LENGTH))
}
</script>

<template>
  <FormField name="summary">
    <template #default="{ field }">
      <DeclaredExperienceSummaryTextarea
        v-bind="$attrs"
        :model-value="(field.state.value ?? '').slice(0, DECLARED_EXPERIENCE_SUMMARY_MAX_LENGTH)"
        :error-message="field.state.meta.errors?.join(', ')"
        @blur="field.handleBlur"
        @update:model-value="onUpdateSummary"
      />
    </template>
  </FormField>
</template>
