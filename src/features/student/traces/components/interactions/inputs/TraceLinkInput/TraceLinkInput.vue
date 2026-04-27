<script setup lang="ts">
import { TRACE_LINK_MAX_LENGTH } from '@/features/student/traces/config'
import { AvInput, type AvInputProps, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'

interface TraceLinkInputProps extends Omit<AvInputProps, 'label' | 'prefixIcon' | 'placeholder' | 'modelValue'> {
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
  maxlength = TRACE_LINK_MAX_LENGTH,
  label,
  prefixIcon,
  placeholder,
  errorMessage,
} = defineProps<TraceLinkInputProps>()

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
  label: label ?? t('student.traces.interactions.inputs.TraceLinkInput.label'),
  prefixIcon: prefixIcon ?? MDI_ICONS.LINK,
  placeholder: placeholder ?? t('student.traces.interactions.inputs.TraceLinkInput.placeholder')
}))
</script>

<template>
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
</template>
