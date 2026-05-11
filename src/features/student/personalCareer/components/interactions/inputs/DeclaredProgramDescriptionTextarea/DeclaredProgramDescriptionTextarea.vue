<script setup lang="ts">
import Input, { type InputProps } from '@/common/components/interaction/inputs/Input/Input.vue'
import { DECLARED_PROGRAM_DESCRIPTION_MAX_LENGTH } from '@/features/student/personalCareer/config'
import { useI18n } from 'vue-i18n'

type DeclaredProgramDescriptionTextareaProps = Omit<InputProps, 'maxlength' | 'isTextarea'>

const {
  label,
  ...restProps
} = defineProps<DeclaredProgramDescriptionTextareaProps>()

const modelValue = defineModel<string>()
const { t } = useI18n()

const inputProps = computed(() => ({
  ...restProps,
  isTextarea: true,
  labelVisible: true,
  textareaMinHeight: '6.5rem',
  maxlength: DECLARED_PROGRAM_DESCRIPTION_MAX_LENGTH,
  label: label ?? t('student.personalCareer.interactions.inputs.DeclaredProgramDescriptionTextarea.label')
}))
</script>

<template>
  <Input
    v-bind="inputProps"
    v-model="modelValue"
  />
</template>
