<script setup lang="ts">
import type { CreateTraceForm, UpdateTraceForm } from '@/features/student/types'
import { TracePersonalNoteTextarea } from '@/features/student/components'

interface TracePersonalNoteTextareaFormFieldProps {
  form: CreateTraceForm | UpdateTraceForm
}

defineProps<TracePersonalNoteTextareaFormFieldProps>()
</script>

<template>
  <form.Field name="personalNote">
    <template #default="{ field }">
      <TracePersonalNoteTextarea
        v-bind="$attrs"
        id="personal-note"
        v-model="field.state.value"
        :error-message="field.state.meta.errors?.join(', ')"
        @blur="field.handleBlur"
        @update:model-value="(value) => typeof value == 'string' ? field.handleChange(value) : field.handleChange(undefined)"
      />
    </template>
  </form.Field>
</template>

<style scoped lang="scss">

</style>
