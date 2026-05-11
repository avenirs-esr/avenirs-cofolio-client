<script setup lang="ts">
import { DECLARED_EXPERIENCE_ACTIVITY_SECTOR_MAX_LENGTH } from '@/features/student/personalCareer/config'
import { AvInput, type AvInputProps, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

type DeclaredExperienceActivitySectorInputProps = Omit<AvInputProps, 'maxlength' | 'hint' | 'prefixIcon'>

const {
  label,
  placeholder,
  ...restProps
} = defineProps<DeclaredExperienceActivitySectorInputProps>()

const modelValue = defineModel<string>()
const { t } = useI18n()

const avInputProps = computed(() => ({
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
  <AvInput
    v-bind="avInputProps"
    v-model="modelValue"
  />
</template>
