<script setup lang="ts">
import type { CreateTraceForm, UpdateTraceForm } from '@/features/traces/types/forms.types'
import TraceAiJustificationTextarea from '@/features/traces/components/interactions/inputs/TraceAiJustificationTextarea/TraceAiJustificationTextarea.vue'
import { markRaw } from 'vue'

interface TraceAiJustificationTextareaFormFieldProps {
  form: CreateTraceForm | UpdateTraceForm
  showAiJustification: boolean
  labelVisible?: boolean
}

const { form } = defineProps<TraceAiJustificationTextareaFormFieldProps>()
const FormField = markRaw(form.Field)
</script>

<template>
  <FormField
    v-if="showAiJustification"
    name="iaJustification"
  >
    <template #default="{ field }">
      <TraceAiJustificationTextarea
        id="ia-justification"
        v-model="field.state.value"
        :error-message="field.state.meta.errors.join(', ')"
        :required="showAiJustification"
        :label-visible="labelVisible"
        v-bind="$attrs"
        @blur="field.handleBlur"
        @update:model-value="(value) => typeof value == 'string' ? field.handleChange(value) : field.handleChange(undefined)"
      />
    </template>
  </FormField>
</template>
