<script setup lang="ts">
import type { CreateTraceForm, UpdateTraceForm } from '@/features/student/types'
import { TraceNameInput } from '@/features/student/components'

interface TraceNameInputFormFieldProps {
  form: CreateTraceForm | UpdateTraceForm
}

defineProps<TraceNameInputFormFieldProps>()
</script>

<template>
  <form.Field name="traceName">
    <template #default="{ field }">
      <TraceNameInput
        v-bind="$attrs"
        id="traceName"
        v-model="field.state.value"
        :error-message="field.state.meta.errors?.join(', ')"
        required
        @blur="field.handleBlur"
        @update:model-value="(value) => typeof value == 'string' && field.handleChange(value)"
      />
    </template>
  </form.Field>
</template>

<style scoped lang="scss">

</style>
