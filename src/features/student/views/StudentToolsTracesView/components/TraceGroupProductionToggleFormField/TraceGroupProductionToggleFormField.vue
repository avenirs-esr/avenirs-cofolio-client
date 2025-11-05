<script setup lang="ts">
import type { CreateTraceForm, UpdateTraceForm } from '@/features/student/types'
import { TraceGroupProductionToggle } from '@/features/student/components'

interface TraceGroupProductionToggleFormFieldProps {
  form: CreateTraceForm | UpdateTraceForm
}

const { form } = defineProps<TraceGroupProductionToggleFormFieldProps>()
const FormField = form.Field
</script>

<template>
  <FormField name="isGroup">
    <template #default="{ field }">
      <TraceGroupProductionToggle
        v-bind="$attrs"
        id="is-group"
        name="isGroup"
        :model-value="field.state.value"
        @update:model-value="(value) => field.handleChange(value)"
      />
    </template>
  </FormField>
</template>

<style scoped lang="scss">

</style>
