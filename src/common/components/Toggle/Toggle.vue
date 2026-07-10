<script setup lang="ts">
import { AvToggle, type AvToggleProps } from '@avenirs-esr/avenirs-dsav'
import { type ComputedRef, useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'

export interface ToggleProps extends AvToggleProps { }

const props = defineProps<ToggleProps>()
const { t } = useI18n()
const attrs = useAttrs()

const avToggleProps: ComputedRef<AvToggleProps> = computed(() => ({
  ...attrs,
  ...props,
  activeText: props.activeText ?? t('global.avToggle.activeText'),
  inactiveText: props.inactiveText ?? t('global.avToggle.inactiveText'),
}))
</script>

<template>
  <AvToggle
    v-bind="avToggleProps"
  />
</template>
