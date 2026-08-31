<script setup lang="ts">
import type { AddDeclaredExperienceForm, UpdateDeclaredExperienceForm } from '@/features/personalCareer/types/forms.types'
import DeclaredExperienceSummaryTextarea from '@/features/personalCareer/components/interactions/inputs/DeclaredExperienceSummaryTextarea/DeclaredExperienceSummaryTextarea.vue'
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
  summaryField.api.handleChange(String(value ?? ''))
}
</script>

<template>
  <FormField name="summary">
    <template #default="{ field }">
      <DeclaredExperienceSummaryTextarea
        v-bind="$attrs"
        :model-value="(field.state.value ?? '')"
        :error-message="field.state.meta.errors?.join(', ')"
        @blur="field.handleBlur"
        @update:model-value="onUpdateSummary"
      />
    </template>
  </FormField>
</template>
