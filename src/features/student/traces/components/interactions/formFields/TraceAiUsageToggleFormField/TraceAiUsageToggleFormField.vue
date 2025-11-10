<script setup lang="ts">
import type { CreateTraceForm, UpdateTraceForm } from '@/features/student/traces/types/forms.types'
import TraceAiUsageToggle from '@/features/student/traces/components/interactions/toggles/TraceAiUsageToggle/TraceAiUsageToggle.vue'
import { markRaw, useAttrs } from 'vue'

interface TraceAiUsageToggleFormFieldProps {
  form: CreateTraceForm | UpdateTraceForm
}

const { form } = defineProps<TraceAiUsageToggleFormFieldProps>()
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
  <FormField name="useIA">
    <template #default="{ field }">
      <TraceAiUsageToggle
        v-bind="attrs"
        id="use-ia"
        name="useIA"
        :model-value="field.state.value"
        @update:model-value="(value) => handleChange(value, field.handleChange)"
      />
    </template>
  </FormField>
</template>

<style scoped lang="scss">

</style>
