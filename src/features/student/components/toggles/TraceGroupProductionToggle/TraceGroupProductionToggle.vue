<script setup lang="ts">
import { AvToggle, type AvToggleProps } from '@avenirs-esr/avenirs-dsav'
import { useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'

interface TraceGroupProductionToggleProps extends Omit<AvToggleProps, 'description' | 'activeText' | 'inactiveText'> {
  description?: string
}

const props = defineProps<TraceGroupProductionToggleProps>()

const { t } = useI18n()
const attr = useAttrs()

const avToggleProps = computed(() => ({
  ...attr,
  ...props,
  description: props.description ?? t('student.components.traceGroupProductionToggle.description'),
  activeText: t('global.avToggle.activeText'),
  inactiveText: t('global.avToggle.inactiveText')
}))
</script>

<template>
  <AvToggle
    v-bind="avToggleProps"
  />
</template>
