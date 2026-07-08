<script setup lang="ts">
import type { UpdateTraceForm } from '@/features/student/traces/types/forms.types'
import TraceValorizationToggle from '@/features/student/traces/components/interactions/toggles/TraceValorizationToggle/TraceValorizationToggle.vue'
import { markRaw, useAttrs } from 'vue'

interface TraceValorizationToggleFormFieldProps {
  form: UpdateTraceForm
}

const { form } = defineProps<TraceValorizationToggleFormFieldProps>()

const emit = defineEmits<{
  (event: 'change', payload: boolean): void
}>()

const FormField = markRaw(form.Field)

const attrs = useAttrs()

function handleChange (value: boolean, fieldChange: (value: boolean) => void) {
  fieldChange(value)
  emit('change', value)
}
</script>

<template>
  <FormField name="valorized">
    <template #default="{ field }">
      <TraceValorizationToggle
        v-bind="attrs"
        id="trace-valorization"
        name="valorized"
        :model-value="field.state.value"
        @update:model-value="(value) => handleChange(value, field.handleChange)"
      />
    </template>
  </FormField>
</template>
