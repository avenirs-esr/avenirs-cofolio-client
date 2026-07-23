<script setup lang="ts">
import type { ToggleProps } from '@/common/components/Toggle/Toggle.vue'
import Toggle from '@/common/components/Toggle/Toggle.vue'
import { type ComputedRef, useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'

export interface ValorizeToggleProps extends Omit<ToggleProps, 'activeText' | 'inactiveText' | 'statusTextWidth'> { }

const props = defineProps<ValorizeToggleProps>()

const { t } = useI18n()
const attrs = useAttrs()

const toggleProps: ComputedRef<ToggleProps> = computed(() => ({
  ...attrs,
  ...props,
  activeText: t('student.global.interaction.toggles.ValorizeToggle.activeText'),
  inactiveText: t('student.global.interaction.toggles.ValorizeToggle.inactiveText'),
  statusTextWidth: 'fit-content',
}))
</script>

<template>
  <Toggle
    v-bind="toggleProps"
  />
</template>
