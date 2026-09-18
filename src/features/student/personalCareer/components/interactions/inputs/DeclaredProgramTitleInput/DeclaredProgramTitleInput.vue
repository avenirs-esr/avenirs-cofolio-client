<script setup lang="ts">
import Input, { type InputProps } from '@/common/components/interaction/inputs/Input/Input.vue'
import { ICONS } from '@/common/constants'
import { DECLARED_PROGRAM_TITLE_MAX_LENGTH } from '@/features/student/personalCareer/config'
import { useI18n } from 'vue-i18n'

type DeclaredProgramTitleInputProps = Omit<InputProps, 'maxlength' | 'prefixIcon'>

const {
  label,
  placeholder,
  ...restProps
} = defineProps<DeclaredProgramTitleInputProps>()

const modelValue = defineModel<string>()
const { t } = useI18n()

const inputProps = computed(() => ({
  ...restProps,
  labelVisible: true,
  maxlength: DECLARED_PROGRAM_TITLE_MAX_LENGTH,
  label: label ?? t('student.personalCareer.interactions.inputs.DeclaredProgramTitleInput.label'),
  prefixIcon: ICONS.PROGRAMS,
  placeholder: placeholder ?? t('student.personalCareer.interactions.inputs.DeclaredProgramTitleInput.placeholder')
}))
</script>

<template>
  <Input
    v-bind="inputProps"
    v-model="modelValue"
  />
</template>
