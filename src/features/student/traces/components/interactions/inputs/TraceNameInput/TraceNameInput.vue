<script setup lang="ts">
import Input from '@/common/components/interaction/inputs/Input/Input.vue'
import { TRACE_NAME_MAX_LENGTH } from '@/features/student/traces/config'
import { type AvInputProps, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'

interface TraceNameInputProps extends Omit<AvInputProps, 'label' | 'prefixIcon' | 'placeholder' | 'modelValue' | 'maxlength' > {
  label?: string
  prefixIcon?: string
  placeholder?: string
  maxlength?: number
}

const {
  isValid = false,
  isTextarea = false,
  labelVisible = true,
  disabled = false,
  required = true,
  maxlength = TRACE_NAME_MAX_LENGTH,
  label,
  prefixIcon,
  placeholder,
  errorMessage,
} = defineProps<TraceNameInputProps>()

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
  label: label ?? t('student.traces.interactions.inputs.TraceNameInput.label'),
  prefixIcon: prefixIcon ?? MDI_ICONS.ATTACH_FILE,
  placeholder: placeholder ?? t('student.traces.interactions.inputs.TraceNameInput.placeholder')
}))
</script>

<template>
  <Input
    v-bind="avInputProps"
    v-model="modelValue"
  />
</template>
