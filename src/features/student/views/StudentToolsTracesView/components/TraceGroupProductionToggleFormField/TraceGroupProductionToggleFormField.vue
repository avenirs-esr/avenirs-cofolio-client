<script setup lang="ts">
import type { CreateTraceForm, UpdateTraceForm } from '@/features/student/types'
import { TraceGroupProductionToggle } from '@/features/student/components'

interface TraceGroupProductionToggleFormFieldProps {
  form: CreateTraceForm | UpdateTraceForm
}

defineProps<TraceGroupProductionToggleFormFieldProps>()
</script>

<template>
  <form.Field name="isGroup">
    <template #default="{ field }">
      <TraceGroupProductionToggle
        v-bind="$attrs"
        id="is-group"
        name="isGroup"
        :model-value="field.state.value"
        @update:model-value="(value) => field.handleChange(value)"
      />
    </template>
  </form.Field>
</template>

<style scoped lang="scss">

</style>
