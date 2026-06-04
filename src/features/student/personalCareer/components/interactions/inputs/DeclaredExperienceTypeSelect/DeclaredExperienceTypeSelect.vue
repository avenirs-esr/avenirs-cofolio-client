<script setup lang="ts">
import { EExperienceType } from '@/api/avenir-esr'
import { AvSelect, type AvSelectProps, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

type DeclaredExperienceTypeSelectProps = Omit<AvSelectProps, 'options' | 'placeholder' | 'prefixIcon'>

const {
  label,
  ...restProps
} = defineProps<DeclaredExperienceTypeSelectProps>()

const selectedItem = defineModel<{ itemId: EExperienceType }>()
const { t } = useI18n()

const options = computed(() => [
  {
    id: EExperienceType.PROFESSIONAL,
    label: t('student.personalCareer.declaredExperienceType.PROFESSIONAL')
  },
  {
    id: EExperienceType.PERSONAL,
    label: t('student.personalCareer.declaredExperienceType.PERSONAL')
  }
])

const avSelectProps = computed<AvSelectProps>(() => ({
  ...restProps,
  label: label ?? t('student.personalCareer.interactions.inputs.DeclaredExperienceTypeSelect.label'),
  placeholder: t('student.personalCareer.interactions.inputs.DeclaredExperienceTypeSelect.placeholder'),
  prefixIcon: MDI_ICONS.ACCOUNT_CIRCLE_OUTLINE,
  options: options.value,
  labelVisible: true
}))
</script>

<template>
  <AvSelect
    v-bind="avSelectProps"
    v-model:selected-item="selectedItem"
  />
</template>
