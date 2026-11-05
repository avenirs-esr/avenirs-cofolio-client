<script setup lang="ts">
import type { AvToggleProps } from '@avenirs-esr/avenirs-dsav'
import type { ToggleProps } from '@avenirs-esr/shared'
import type { ComputedRef } from 'vue'
import { Toggle } from '@avenirs-esr/shared'
import { useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'

export interface AlertActiveToggleProps extends Omit<ToggleProps, 'description' | 'activeText' | 'inactiveText'> {}

const props = defineProps<AlertActiveToggleProps>()

const { t } = useI18n()
const attrs = useAttrs()

const avToggleProps: ComputedRef<AvToggleProps> = computed(() => ({
  ...attrs,
  ...props,
  description: t('global-alert.components.interactions.inputs.AlertActiveToggle.description'),
  activeText: t('global-alert.components.interactions.inputs.AlertActiveToggle.activeText'),
  inactiveText: t('global-alert.components.interactions.inputs.AlertActiveToggle.inactiveText'),
}))
</script>

<template>
  <Toggle v-bind="avToggleProps" />
</template>
