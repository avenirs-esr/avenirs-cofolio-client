<script setup lang="ts">
import { DECLARED_PROGRAM_RESULT_MAX_LENGTH } from '@/features/student/personalCareer/config'
import { AvInput, type AvInputProps, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

type DeclaredProgramResultInputProps = Omit<AvInputProps, 'maxlength'>

const {
  label,
  prefixIcon,
  placeholder,
  ...restProps
} = defineProps<DeclaredProgramResultInputProps>()

const modelValue = defineModel<string>()
const { t } = useI18n()

const avInputProps = computed(() => ({
  ...restProps,
  labelVisible: true,
  maxlength: DECLARED_PROGRAM_RESULT_MAX_LENGTH,
  label: label ?? t('student.personalCareer.interactions.inputs.DeclaredProgramResultInput.label'),
  prefixIcon: prefixIcon ?? RI_ICONS.LAYOUT_6_LINE,
  placeholder: placeholder ?? t('student.personalCareer.interactions.inputs.DeclaredProgramResultInput.placeholder')
}))
</script>

<template>
  <AvInput
    v-bind="avInputProps"
    v-model="modelValue"
  />
</template>
