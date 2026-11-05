<script setup lang="ts">
import type { ToggleProps } from '@avenirs-esr/shared'
import { Toggle } from '@avenirs-esr/shared'
import { useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'

interface TraceAiUsageToggleProps extends Omit<ToggleProps, 'description' | 'activeText' | 'inactiveText'> {
  description?: string
}

const props = defineProps<TraceAiUsageToggleProps>()

const { t } = useI18n()
const attr = useAttrs()

const toggleProps = computed(() => ({
  ...attr,
  ...props,
  description: props.description ?? t('student.traces.interactions.toggles.TraceAiUsageToggle.description'),
}))
</script>

<template>
  <Toggle
    v-bind="toggleProps"
  />
</template>
