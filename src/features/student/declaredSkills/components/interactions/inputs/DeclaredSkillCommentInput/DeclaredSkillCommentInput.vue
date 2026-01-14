<script setup lang="ts">
import { AvInput, type AvInputProps } from '@avenirs-esr/avenirs-dsav'
import { useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'

const {
  isValid = false,
  isTextarea = true,
  labelVisible = true,
  disabled = false,
  required = true,
  maxlength = 400,
  id,
  label,
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
  maxlength,
  id: id ?? `declared-skill-comment-input-${crypto.randomUUID()}`,
  label: label ?? t('student.declaredSkills.interactions.inputs.DeclaredSkillCommentFormField.label'),
}))
</script>

<template>
  <AvInput
    v-bind="avInputProps"
    v-model="modelValue"
    label-class="caption-regular"
  />
</template>
