<script setup lang="ts">
import { DECLARED_PROGRAM_TITLE_MAX_LENGTH } from '@/features/student/declaredPrograms/config'
import { AvInput, type AvInputProps, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

type DeclaredProgramTitleInputProps = Omit<AvInputProps, 'maxlength'>

const {
  label,
  prefixIcon,
  placeholder,
  ...restProps
} = defineProps<DeclaredProgramTitleInputProps>()

const modelValue = defineModel<string>()
const { t } = useI18n()

const avInputProps = computed(() => ({
  ...restProps,
  maxlength: DECLARED_PROGRAM_TITLE_MAX_LENGTH,
  label: label ?? t('student.declaredPrograms.interactions.inputs.DeclaredProgramTitleInput.label'),
  prefixIcon: prefixIcon ?? MDI_ICONS.ATTACH_FILE,
  placeholder: placeholder ?? t('student.declaredPrograms.interactions.inputs.DeclaredProgramTitleInput.placeholder')
}))
</script>

<template>
  <AvInput
    v-bind="avInputProps"
    v-model="modelValue"
  />
</template>
