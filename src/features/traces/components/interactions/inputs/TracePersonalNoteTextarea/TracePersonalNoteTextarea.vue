<script setup lang="ts">
import { TRACE_PERSONAL_NOTE_MAX_LENGTH } from '@/features/traces/config'
import { AvInput, type AvInputProps } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface TracePersonalNoteTextareaProps extends Omit<AvInputProps, 'label' | 'placeholder' | 'modelValue' | 'maxlength' | 'isTextarea'> {
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
  maxlength = TRACE_PERSONAL_NOTE_MAX_LENGTH,
  label,
  placeholder,
  errorMessage,
} = defineProps<TracePersonalNoteTextareaProps>()

const modelValue = defineModel<string>()
const { t } = useI18n()

const avInputProps = computed(() => ({
  isValid,
  isTextarea,
  labelVisible,
  disabled,
  required,
  maxlength,
  errorMessage,
  label: label ?? t('student.traces.interactions.inputs.TracePersonalNoteTextarea.label'),
  placeholder: placeholder ?? t('student.traces.interactions.inputs.TracePersonalNoteTextarea.placeholder')
}))
</script>

<template>
  <div class="av-col av-flex-fill">
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
