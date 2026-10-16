<script setup lang="ts">
import type { InputProps } from '@/common/components/interaction/inputs/Input/Input.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import Input from '@/common/components/interaction/inputs/Input/Input.vue'
import { DECLARED_EXPERIENCE_SOURCE_OF_INFORMATION_MAX_LENGTH } from '@/features/student/personalCareer/config'

type DeclaredExperienceSourceOfInformationInputProps = Omit<InputProps, 'maxlength'>

const {
  label,
  prefixIcon,
  placeholder,
  ...restProps
} = defineProps<DeclaredExperienceSourceOfInformationInputProps>()

const modelValue = defineModel<string>()
const { t } = useI18n()

const inputProps = computed(() => ({
  ...restProps,
  labelVisible: true,
  label: label ?? t('student.personalCareer.interactions.inputs.DeclaredExperienceSourceOfInformationInput.label'),
  maxlength: DECLARED_EXPERIENCE_SOURCE_OF_INFORMATION_MAX_LENGTH,
  prefixIcon: prefixIcon ?? MDI_ICONS.INFORMATION_OUTLINE,
  placeholder: placeholder ?? t('student.personalCareer.interactions.inputs.DeclaredExperienceSourceOfInformationInput.placeholder')
}))
</script>

<template>
  <Input
    v-bind="inputProps"
    v-model="modelValue"
  />
</template>
