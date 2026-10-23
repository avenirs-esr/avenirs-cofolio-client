<script setup lang="ts">
import type { AvSelectOption, AvSelectProps, AvSelectSelectedOption } from '@avenirs-esr/avenirs-dsav'
import { AvSelect, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { EExperienceType } from '@/api/avenir-esr'

type DeclaredExperienceTypeSelectProps = Omit<AvSelectProps, 'options' | 'placeholder' | 'prefixIcon' | 'label'>

const { ...props } = defineProps<DeclaredExperienceTypeSelectProps>()

const selectedItem = defineModel<{ itemId: EExperienceType }>({ required: false })
const { t } = useI18n()

const options = computed<AvSelectOption[]>(() => [
  {
    value: EExperienceType.PROFESSIONAL,
    label: t('student.personalCareer.declaredExperienceType.PROFESSIONAL'),
  },
  {
    value: EExperienceType.PERSONAL,
    label: t('student.personalCareer.declaredExperienceType.PERSONAL'),
  },
  {
    value: EExperienceType.VOLUNTEER,
    label: t('student.personalCareer.declaredExperienceType.VOLUNTEER'),
  },
])

const selectedOption = computed<AvSelectSelectedOption | null>({
  get: () => options.value.find(option => option.value === selectedItem.value?.itemId) ?? null,
  set: (option) => {
    if (option) {
      selectedItem.value = { itemId: option.value as EExperienceType }
    }
  },
})

const avSelectProps = computed<AvSelectProps>(() => ({
  ...props,
  label: t('student.personalCareer.interactions.inputs.DeclaredExperienceTypeSelect.label'),
  placeholder: t('student.personalCareer.interactions.inputs.DeclaredExperienceTypeSelect.placeholder'),
  prefixIcon: MDI_ICONS.ACCOUNT_CIRCLE_OUTLINE,
  options: options.value,
  labelVisible: true,
  width: '100%',
}))
</script>

<template>
  <AvSelect
    v-bind="avSelectProps"
    v-model="selectedOption"
  />
</template>
