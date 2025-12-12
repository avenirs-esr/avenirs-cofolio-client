<script setup lang="ts">
import { DECLARED_PROGRAM_SOURCE_OF_INFORMATION_MAX_LENGTH } from '@/features/student/declaredPrograms/config'
import { AvInput, type AvInputProps, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

type DeclaredProgramSourceOfInformationInputProps = Omit<AvInputProps, 'maxlength'>

const {
  label,
  prefixIcon,
  placeholder,
  ...restProps
} = defineProps<DeclaredProgramSourceOfInformationInputProps>()

const modelValue = defineModel<string>()
const { t } = useI18n()

const avInputProps = computed(() => ({
  ...restProps,
  labelVisible: true,
  maxlength: DECLARED_PROGRAM_SOURCE_OF_INFORMATION_MAX_LENGTH,
  label: label ?? t('student.declaredPrograms.interactions.inputs.DeclaredProgramSourceOfInformationInput.label'),
  prefixIcon: prefixIcon ?? MDI_ICONS.NEWSPAPER_VARIANT,
  placeholder: placeholder ?? t('student.declaredPrograms.interactions.inputs.DeclaredProgramSourceOfInformationInput.placeholder')
}))
</script>

<template>
  <AvInput
    v-bind="avInputProps"
    v-model="modelValue"
  />
</template>
