<script setup lang="ts">
import { DECLARED_EXPERIENCE_LOCATION_MAX_LENGTH } from '@/features/student/personalCareer/config'
import { AvInput, type AvInputProps, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

type DeclaredExperienceLocationInputProps = Omit<AvInputProps, 'maxlength'>

const {
  label,
  prefixIcon,
  placeholder,
  ...restProps
} = defineProps<DeclaredExperienceLocationInputProps>()

const modelValue = defineModel<string>()
const { t } = useI18n()

const avInputProps = computed(() => ({
  ...restProps,
  labelVisible: true,
  label: label ?? t('student.personalCareer.interactions.inputs.DeclaredExperienceLocationInput.label'),
  maxlength: DECLARED_EXPERIENCE_LOCATION_MAX_LENGTH,
  prefixIcon: prefixIcon ?? MDI_ICONS.MAP_MARKER_OUTLINE,
  placeholder: placeholder ?? t('student.personalCareer.interactions.inputs.DeclaredExperienceLocationInput.placeholder')
}))
</script>

<template>
  <AvInput
    v-bind="avInputProps"
    v-model="modelValue"
  />
</template>
