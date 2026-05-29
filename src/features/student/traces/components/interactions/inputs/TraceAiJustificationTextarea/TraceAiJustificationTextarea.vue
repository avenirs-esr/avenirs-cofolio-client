<script setup lang="ts">
import { TRACE_IA_JUSTIFICATION_MAX_LENGTH } from '@/features/student/traces/config'
import { AvInput, type AvInputProps } from '@avenirs-esr/avenirs-dsav'
import { useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'

interface TraceAiJustificationTextareaProps extends Omit<AvInputProps, 'label' | 'placeholder' | 'modelValue' | 'maxlength' | 'isTextarea'> {
  label?: string
  placeholder?: string
  maxlength?: number
  isTextarea?: boolean
}

const {
  isValid = false,
  isTextarea = true,
  labelVisible = true,
  disabled = false,
  required = false,
  maxlength = TRACE_IA_JUSTIFICATION_MAX_LENGTH,
  label,
  placeholder,
  errorMessage,
} = defineProps<TraceAiJustificationTextareaProps>()

const modelValue = defineModel<string>()
const { t } = useI18n()
const attr = useAttrs()

const avInputProps = computed(() => ({
  ...attr,
  isValid,
  isTextarea,
  labelVisible,
  disabled,
  required,
  maxlength,
  errorMessage,
  label: label ?? t('student.traces.interactions.inputs.TraceAiJustificationTextarea.label'),
  placeholder: placeholder ?? t('student.traces.interactions.inputs.TraceAiJustificationTextarea.placeholder')
}))
</script>

<template>
  <div class="trace-ai-justification-textarea">
    <AvInput
      v-bind="avInputProps"
      v-model="modelValue"
    >
      <template
        v-if="!$slots.maxLengthCaption"
        #maxLengthCaption="{ currentValue }"
      >
        <span class="caption-light">
          {{ t('global.inputs.textarea.limit', {
            count: currentValue?.toString().length || 0,
            maxlength,
          }) }}
        </span>
      </template>
    </AvInput>
  </div>
</template>
