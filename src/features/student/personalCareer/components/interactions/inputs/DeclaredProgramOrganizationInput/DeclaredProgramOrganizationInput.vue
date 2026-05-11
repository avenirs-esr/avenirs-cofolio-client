<script setup lang="ts">
import Input, { type InputProps } from '@/common/components/interaction/inputs/Input/Input.vue'
import { DECLARED_PROGRAM_ORGANIZATION_MAX_LENGTH } from '@/features/student/personalCareer/config'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

type DeclaredProgramInstitutionInputProps = Omit<InputProps, 'maxlength'>

const {
  label,
  prefixIcon,
  placeholder,
  ...restProps
} = defineProps<DeclaredProgramInstitutionInputProps>()

const modelValue = defineModel<string>()
const { t } = useI18n()

const inputProps = computed(() => ({
  ...restProps,
  labelVisible: true,
  label: label ?? t('student.personalCareer.interactions.inputs.DeclaredProgramOrganizationInput.label'),
  maxlength: DECLARED_PROGRAM_ORGANIZATION_MAX_LENGTH,
  prefixIcon: prefixIcon ?? MDI_ICONS.BUILDING,
  placeholder: placeholder ?? t('student.personalCareer.interactions.inputs.DeclaredProgramOrganizationInput.placeholder')
}))
</script>

<template>
  <Input
    v-bind="inputProps"
    v-model="modelValue"
  />
</template>
