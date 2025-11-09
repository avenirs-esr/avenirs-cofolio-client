<script setup lang="ts">
import type { CreateTraceForm, UpdateTraceForm } from '@/features/student/traces'
import TraceIaJustificationTextarea from '@/features/student/traces/components/interactions/inputs/TraceIaJustificationTextarea/TraceIaJustificationTextarea.vue'
import { markRaw } from 'vue'

interface TraceIaJustificationTextareaFormFieldProps {
  form: CreateTraceForm | UpdateTraceForm
  showAiJustification: boolean
  labelVisible?: boolean
}

const { form } = defineProps<TraceIaJustificationTextareaFormFieldProps>()
const FormField = markRaw(form.Field)
</script>

<template>
  <FormField
    v-if="showAiJustification"
    name="iaJustification"
  >
    <template #default="{ field }">
      <TraceIaJustificationTextarea
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
