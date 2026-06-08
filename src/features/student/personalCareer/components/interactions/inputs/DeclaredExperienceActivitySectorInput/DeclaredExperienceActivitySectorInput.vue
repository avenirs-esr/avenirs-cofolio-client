<script setup lang="ts">
import Input, { type InputProps } from '@/common/components/interaction/inputs/Input/Input.vue'
import { DECLARED_EXPERIENCE_ACTIVITY_SECTOR_MAX_LENGTH } from '@/features/student/personalCareer/config'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

type DeclaredExperienceActivitySectorInputProps = Omit<InputProps, 'maxlength' | 'hint' | 'prefixIcon'>

const {
  label,
  placeholder,
  ...restProps
} = defineProps<DeclaredExperienceActivitySectorInputProps>()

const modelValue = defineModel<string>()
const { t } = useI18n()

const inputProps = computed(() => ({
  ...restProps,
  labelVisible: true,
  label: label ?? t('student.personalCareer.interactions.inputs.DeclaredExperienceActivitySectorInput.label'),
  maxlength: DECLARED_EXPERIENCE_ACTIVITY_SECTOR_MAX_LENGTH,
  prefixIcon: MDI_ICONS.BUILDING,
  placeholder: placeholder ?? t('student.personalCareer.interactions.inputs.DeclaredExperienceActivitySectorInput.placeholder'),
  hint: !restProps.disabled ? t('student.personalCareer.interactions.inputs.DeclaredExperienceActivitySectorInput.hint') : undefined
}))
</script>

<template>
  <Input
    v-bind="inputProps"
    v-model="modelValue"
  />
</template>
