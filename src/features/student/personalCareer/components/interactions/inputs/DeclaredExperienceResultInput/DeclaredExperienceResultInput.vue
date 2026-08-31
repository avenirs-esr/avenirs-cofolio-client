<script setup lang="ts">
import Input, { type InputProps } from '@/common/components/interaction/inputs/Input/Input.vue'
import { DECLARED_EXPERIENCE_RESULT_MAX_LENGTH } from '@/features/student/personalCareer/config'
import { RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

type DeclaredExperienceResultInputProps = Omit<InputProps, 'maxlength'>

const {
  label,
  prefixIcon,
  placeholder,
  ...restProps
} = defineProps<DeclaredExperienceResultInputProps>()

const modelValue = defineModel<string>()
const { t } = useI18n()

const inputProps = computed(() => ({
  ...restProps,
  labelVisible: true,
  maxlength: DECLARED_EXPERIENCE_RESULT_MAX_LENGTH,
  label: label ?? t('student.personalCareer.interactions.inputs.DeclaredExperienceResultInput.label'),
  prefixIcon: prefixIcon ?? RI_ICONS.LAYOUT_6_LINE,
  placeholder: placeholder ?? t('student.personalCareer.interactions.inputs.DeclaredExperienceResultInput.placeholder')
}))
</script>

<template>
  <Input
    v-bind="inputProps"
    v-model="modelValue"
  />
</template>
