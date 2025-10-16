<script setup lang="ts">
import { AvToggle, type AvToggleProps } from '@avenirs-esr/avenirs-dsav'
import { useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'

interface TraceAiUsageToggleProps extends Omit<AvToggleProps, 'description' | 'activeText' | 'inactiveText'> {
  description?: string
}

const props = defineProps<TraceAiUsageToggleProps>()

const { t } = useI18n()
const attr = useAttrs()

const avToggleProps = computed(() => ({
  ...attr,
  ...props,
  description: props.description ?? t('student.components.traceAiUsageToggle.description'),
  activeText: t('global.avToggle.activeText'),
  inactiveText: t('global.avToggle.inactiveText'),
}))
</script>

<template>
  <AvToggle
    v-bind="avToggleProps"
  />
</template>
