<script setup lang="ts">
import { EExperienceType } from '@/api/avenir-esr'
import { AvSelect, type AvSelectProps, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

type DeclaredExperienceTypeSelectProps = Omit<AvSelectProps, 'options' | 'placeholder' | 'prefixIcon'>

const {
  label,
  ...restProps
} = defineProps<DeclaredExperienceTypeSelectProps>()

const modelValue = defineModel<EExperienceType>()
const { t } = useI18n()

const options = computed(() => [
  {
    value: EExperienceType.PROFESSIONAL,
    text: t('student.personalCareer.declaredExperienceType.PROFESSIONAL')
  },
  {
    value: EExperienceType.PERSONAL,
    text: t('student.personalCareer.declaredExperienceType.PERSONAL')
  }
])

const avSelectProps = computed<AvSelectProps>(() => ({
  ...restProps,
  label: label ?? t('student.personalCareer.interactions.inputs.DeclaredExperienceTypeSelect.label'),
  placeholder: t('student.personalCareer.interactions.inputs.DeclaredExperienceTypeSelect.placeholder'),
  prefixIcon: MDI_ICONS.ACCOUNT_CIRCLE_OUTLINE,
  options: options.value
}))
</script>

<template>
  <AvSelect
    v-bind="avSelectProps"
    v-model="modelValue"
  />
</template>
