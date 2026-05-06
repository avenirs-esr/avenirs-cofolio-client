<script setup lang="ts">
import Input, { type InputProps } from '@/common/components/interaction/inputs/Input/Input.vue'
import { DECLARED_EXPERIENCE_EXTERNAL_LINK_MAX_LENGTH } from '@/features/student/personalCareer/config'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

type DeclaredExperienceExternalLinkInputProps = Omit<InputProps, 'maxlength'>

const {
  label,
  prefixIcon,
  placeholder,
  ...restProps
} = defineProps<DeclaredExperienceExternalLinkInputProps>()

const modelValue = defineModel<string>()
const { t } = useI18n()

const avInputProps = computed(() => ({
  ...restProps,
  labelVisible: true,
  label: label ?? t('student.personalCareer.interactions.inputs.DeclaredExperienceExternalLinkInput.label'),
  maxlength: DECLARED_EXPERIENCE_EXTERNAL_LINK_MAX_LENGTH,
  prefixIcon: prefixIcon ?? MDI_ICONS.LINK,
  placeholder: placeholder ?? t('student.personalCareer.interactions.inputs.DeclaredExperienceExternalLinkInput.placeholder')
}))
</script>

<template>
  <Input
    v-bind="avInputProps"
    v-model="modelValue"
  />
</template>
