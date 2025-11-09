<script setup lang="ts">
import type { CreateTraceForm, UpdateTraceForm } from '@/features/student/traces'
import TraceNameInput from '@/features/student/traces/components/interactions/inputs/TraceNameInput/TraceNameInput.vue'
import { markRaw } from 'vue'

interface TraceNameInputFormFieldProps {
  form: CreateTraceForm | UpdateTraceForm
}

const { form } = defineProps<TraceNameInputFormFieldProps>()
const FormField = markRaw(form.Field)
</script>

<template>
  <FormField name="traceName">
    <template #default="{ field }">
      <TraceNameInput
        v-bind="$attrs"
        id="trace-name"
        v-model="field.state.value"
        :error-message="field.state.meta.errors?.join(', ')"
        required
        @blur="field.handleBlur"
        @update:model-value="(value) => typeof value == 'string' && field.handleChange(value)"
      />
    </template>
  </FormField>
</template>

<style scoped lang="scss">

</style>
