<script setup lang="ts">
import { DECLARED_EXPERIENCE_ORGANIZATION_MAX_LENGTH } from '@/features/student/personalCareer/config'
import { AvInput, type AvInputProps, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

type DeclaredExperienceOrganizationInputProps = Omit<AvInputProps, 'maxlength'>

const {
  label,
  prefixIcon,
  placeholder,
  ...restProps
} = defineProps<DeclaredExperienceOrganizationInputProps>()

const modelValue = defineModel<string>()
const { t } = useI18n()

const avInputProps = computed(() => ({
  ...restProps,
  labelVisible: true,
  label: label ?? t('student.personalCareer.interactions.inputs.DeclaredExperienceOrganizationInput.label'),
  maxlength: DECLARED_EXPERIENCE_ORGANIZATION_MAX_LENGTH,
  prefixIcon: prefixIcon ?? MDI_ICONS.BUILDING,
  placeholder: placeholder ?? t('student.personalCareer.interactions.inputs.DeclaredExperienceOrganizationInput.placeholder')
}))
</script>

<template>
  <AvInput
    v-bind="avInputProps"
    v-model="modelValue"
  />
</template>
