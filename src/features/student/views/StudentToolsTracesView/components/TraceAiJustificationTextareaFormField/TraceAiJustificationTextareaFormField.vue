<script setup lang="ts">
import type { CreateTraceForm, UpdateTraceForm } from '@/features/student/types'
import { TraceIaJustificationTextarea } from '@/features/student/components'

interface TraceIaJustificationTextareaFormFieldProps {
  form: CreateTraceForm | UpdateTraceForm
  showAiJustification: boolean
  labelVisible?: boolean
}

defineProps<TraceIaJustificationTextareaFormFieldProps>()
</script>

<template>
  <form.Field
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
  </form.Field>
</template>
