<script setup lang="ts">
import { DECLARED_PROGRAM_INSTITUTION_MAX_LENGTH } from '@/features/student/declaredPrograms/config'
import { AvInput, type AvInputProps, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

type DeclaredProgramInstitutionInputProps = Omit<AvInputProps, 'maxlength'>

const {
  label,
  prefixIcon,
  placeholder,
  ...restProps
} = defineProps<DeclaredProgramInstitutionInputProps>()

const modelValue = defineModel<string>()
const { t } = useI18n()

const avInputProps = computed(() => ({
  ...restProps,
  labelVisible: true,
  label: label ?? t('student.declaredPrograms.interactions.inputs.DeclaredProgramInstitutionInput.label'),
  maxlength: DECLARED_PROGRAM_INSTITUTION_MAX_LENGTH,
  prefixIcon: prefixIcon ?? MDI_ICONS.BUILDING,
  placeholder: placeholder ?? t('student.declaredPrograms.interactions.inputs.DeclaredProgramInstitutionInput.placeholder')
}))
</script>

<template>
  <AvInput
    v-bind="avInputProps"
    v-model="modelValue"
  />
</template>
