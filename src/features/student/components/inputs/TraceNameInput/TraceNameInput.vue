<script setup lang="ts">
import { AvInput, type AvInputProps, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'

interface TraceNameInputProps extends Omit<AvInputProps, 'label' | 'prefixIcon' | 'placeholder' | 'modelValue'> {
  label?: string
  prefixIcon?: string
  placeholder?: string
}

const props = withDefaults(defineProps<TraceNameInputProps>(), {
  isValid: false,
  isTextarea: false,
  labelVisible: true,
  disabled: false,
  required: true
})

const modelValue = defineModel<string>()
const { t } = useI18n()
const attr = useAttrs()

const avInputProps = computed(() => ({
  ...attr,
  ...props,
  label: props.label ?? t('student.components.traceNameInput.label'),
  prefixIcon: props.prefixIcon ?? MDI_ICONS.ATTACH_FILE,
  placeholder: props.placeholder ?? t('student.components.traceNameInput.placeholder')
}))
</script>

<template>
  <AvInput
    v-bind="avInputProps"
    v-model="modelValue"
  />
</template>
