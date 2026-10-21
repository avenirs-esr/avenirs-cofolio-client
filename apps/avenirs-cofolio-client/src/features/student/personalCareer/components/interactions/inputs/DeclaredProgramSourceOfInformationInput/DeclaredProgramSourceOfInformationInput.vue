<script setup lang="ts">
import type { InputProps } from '@/common/components/interaction/inputs/Input/Input.vue'
import { useI18n } from 'vue-i18n'
import Input from '@/common/components/interaction/inputs/Input/Input.vue'
import { ICONS } from '@/common/constants/icons'
import { DECLARED_PROGRAM_SOURCE_OF_INFORMATION_MAX_LENGTH } from '@/features/student/personalCareer/config'

type DeclaredProgramSourceOfInformationInputProps = Omit<InputProps, 'maxlength'>

const {
  label,
  prefixIcon,
  placeholder,
  ...restProps
} = defineProps<DeclaredProgramSourceOfInformationInputProps>()

const modelValue = defineModel<string>()
const { t } = useI18n()

const inputProps = computed(() => ({
  ...restProps,
  labelVisible: true,
  maxlength: DECLARED_PROGRAM_SOURCE_OF_INFORMATION_MAX_LENGTH,
  label: label ?? t('student.personalCareer.interactions.inputs.DeclaredProgramSourceOfInformationInput.label'),
  prefixIcon: prefixIcon ?? ICONS.SOURCE_OF_INFORMATIONS,
  placeholder: placeholder ?? t('student.personalCareer.interactions.inputs.DeclaredProgramSourceOfInformationInput.placeholder')
}))
</script>

<template>
  <Input
    v-bind="inputProps"
    v-model="modelValue"
  />
</template>
