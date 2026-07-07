<script setup lang="ts">
import type { CreateTraceForm, UpdateTraceForm } from '@/features/student/traces/types/forms.types'
import TraceLinkInput from '@/features/student/traces/components/interactions/inputs/TraceLinkInput/TraceLinkInput.vue'
import { markRaw } from 'vue'

interface TraceLinkInputFormFieldProps {
  form: CreateTraceForm | UpdateTraceForm
}

const { form } = defineProps<TraceLinkInputFormFieldProps>()
const FormField = markRaw(form.Field)
</script>

<template>
  <FormField name="link">
    <template #default="{ field }">
      <TraceLinkInput
        v-bind="$attrs"
        id="trace-link"
        v-model="field.state.value"
        :error-message="field.state.meta.errors?.join(', ')"
        required
        @blur="field.handleBlur"
        @update:model-value="(value) => typeof value == 'string' && field.handleChange(value)"
      />
    </template>
  </FormField>
</template>
