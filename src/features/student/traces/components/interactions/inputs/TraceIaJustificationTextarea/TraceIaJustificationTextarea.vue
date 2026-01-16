<script setup lang="ts">
import { AvInput, type AvInputProps } from '@avenirs-esr/avenirs-dsav'
import { useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'

interface TraceIaJustificationTextareaProps extends Omit<AvInputProps, 'label' | 'placeholder' | 'modelValue' | 'maxlength' | 'isTextarea'> {
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
  maxlength = 200,
  label,
  placeholder,
  errorMessage,
} = defineProps<TraceIaJustificationTextareaProps>()

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
  label: label ?? t('student.traces.interactions.inputs.TraceIaJustificationTextarea.label'),
  placeholder: placeholder ?? t('student.traces.interactions.inputs.TraceIaJustificationTextarea.placeholder')
}))
</script>

<template>
  <div class="trace-ia-justification-textarea">
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
