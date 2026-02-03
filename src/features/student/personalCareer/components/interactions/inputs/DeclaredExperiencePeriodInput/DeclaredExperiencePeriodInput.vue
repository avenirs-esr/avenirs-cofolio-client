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
  separatorSpacing: 'var(--spacing-sm)'
}))
</script>

<template>
  <div class="period-input-wrapper">
    <AvPeriodInput
      class="compact-period-input"
      v-bind="avPeriodInputProps"
    />
  </div>
</template>

<style scoped lang="scss">
.period-input-wrapper {
  display: flex;
  justify-content: flex-start;
  width: auto;
}

.compact-period-input {
  width: auto !important;
  max-width: none !important;

  :deep(> div) {
     justify-content: flex-start !important;
  }

  :deep(.fr-input-group) {
    flex: 0 0 auto !important;
    width: auto !important;
    min-width: 0 !important;
  }

  :deep(input),
  :deep(.fr-input) {
    width: 10rem !important;
    min-width: 10rem !important;
    flex: 0 0 auto !important;
  }
}
</style>
