<script setup lang="ts">
import { AvPeriodInput, type AvPeriodInputProps, useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import { useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'

type DeclaredExperiencePeriodInputProps = Omit<AvPeriodInputProps, 'label' | 'startLabel' | 'endLabel' | 'separatorSpacing' | 'stacked' | 'type'>

const { labelClass, ...restProps } = defineProps<DeclaredExperiencePeriodInputProps>()
const { t } = useI18n()
const { isMobile } = useAvBreakpoints()
const attrs = useAttrs()

const avPeriodInputProps = computed<AvPeriodInputProps>(() => ({
  ...attrs,
  ...restProps,
  type: 'month',
  label: t('student.personalCareer.interactions.inputs.DeclaredExperiencePeriodInput.label'),
  labelClass,
  startLabel: t('student.personalCareer.interactions.inputs.DeclaredExperiencePeriodInput.startLabel'),
  endLabel: t('student.personalCareer.interactions.inputs.DeclaredExperiencePeriodInput.endLabel'),
  stacked: isMobile.value,
  separatorSpacing: 'var(--spacing-sm)',
  width: '10rem',
  inProgressLabel: t('student.personalCareer.interactions.formFields.DeclaredExperiencePeriodFormField.ongoing'),
}))
</script>

<template>
  <AvPeriodInput v-bind="avPeriodInputProps" />
</template>
