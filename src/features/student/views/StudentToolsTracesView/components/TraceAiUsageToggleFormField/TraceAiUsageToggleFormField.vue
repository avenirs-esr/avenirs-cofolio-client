<script setup lang="ts">
import type { CreateTraceForm, UpdateTraceForm } from '@/features/student/types'
import { TraceAiUsageToggle } from '@/features/student/components'
import { useAttrs } from 'vue'

interface TraceAiUsageToggleFormFieldProps {
  form: CreateTraceForm | UpdateTraceForm
}

defineProps<TraceAiUsageToggleFormFieldProps>()

const emit = defineEmits<{
  (event: 'change', payload: boolean): void
}>()

const attrs = useAttrs()

function handleChange (value: boolean, fieldChange: (value: boolean) => void) {
  fieldChange(value)
  emit('change', value)
}
</script>

<template>
  <form.Field name="useIA">
    <template #default="{ field }">
      <div class="declaration-items__field">
        <TraceAiUsageToggle
          v-bind="attrs"
          id="useIA"
          name="useIA"
          :model-value="field.state.value"
          @update:model-value="(value) => handleChange(value, field.handleChange)"
        />
        <div
          v-if="field.state.meta.errors.length > 0"
          class="declaration-items__error"
        >
          {{ field.state.meta.errors.join(', ') }}
        </div>
      </div>
    </template>
  </form.Field>
</template>

<style scoped lang="scss">

</style>
