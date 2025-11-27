<script setup lang="ts">
import { AvInput, type AvInputProps, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'

const {
  isValid = false,
  isTextarea = false,
  labelVisible = true,
  disabled = false,
  required = true,
  label,
  prefixIcon,
  placeholder,
  errorMessage,
} = defineProps<AvInputProps>()

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
  errorMessage,
  label: label ?? t('student.selfKnowledge.categoryElementTitleInput.label'),
  prefixIcon: prefixIcon ?? MDI_ICONS.ATTACH_FILE,
  placeholder: placeholder ?? t('student.selfKnowledge.categoryElementTitleInput.placeholder')
}))
</script>

<template>
  <AvInput
    v-bind="avInputProps"
    v-model="modelValue"
  />
</template>
