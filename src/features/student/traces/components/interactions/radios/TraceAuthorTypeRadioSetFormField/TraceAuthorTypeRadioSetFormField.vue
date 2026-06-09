<script setup lang="ts">
import type { CreateTraceForm, UpdateTraceForm } from '@/features/student/traces/types/forms.types'
import { ETraceAuthorType } from '@/api/avenir-esr'
import { isEnumMember } from '@/common/utils'
import TraceAuthorTypeRadioSet from '@/features/student/traces/components/interactions/radios/TraceAuthorTypeRadioSet/TraceAuthorTypeRadioSet.vue'
import { markRaw } from 'vue'

interface TraceAuthorTypeRadioSetFormFieldProps {
  form: CreateTraceForm | UpdateTraceForm
}

const { form } = defineProps<TraceAuthorTypeRadioSetFormFieldProps>()
const FormField = markRaw(form.Field)
</script>

<template>
  <FormField name="authorType">
    <template #default="{ field }">
      <TraceAuthorTypeRadioSet
        v-bind="$attrs"
        :model-value="field.state.value"
        :error-message="field.state.meta.errors?.join(', ')"
        @update:model-value="(value) => {
          if (typeof value === 'string' && isEnumMember(ETraceAuthorType, value)) {
            field.handleChange(value)
          }
        }"
        @blur="field.handleBlur"
      />
    </template>
  </FormField>
</template>
