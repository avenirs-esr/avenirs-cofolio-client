<script setup lang="ts">
import type { ToggleProps } from '@/common/components/Toggle/Toggle.vue'
import type { ComputedRef } from 'vue'
import ValorizedBadge from '@/common/components/badges/ValorizedBadge/ValorizedBadge.vue'
import Toggle from '@/common/components/Toggle/Toggle.vue'
import { useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'

export interface ValorizeToggleProps extends Omit<ToggleProps, 'activeText' | 'inactiveText'> {}

const props = defineProps<ValorizeToggleProps>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const { t } = useI18n()
const attrs = useAttrs()

const toggleProps: ComputedRef<ToggleProps> = computed(() => ({
  ...attrs,
  ...props,
  tooltip: props.tooltip ?? t(`student.global.interaction.toggles.ValorizeToggle.${props.modelValue ? 'unvalorizeTooltip' : 'valorizeTooltip'}`),
}))
</script>

<template>
  <Toggle
    v-bind="toggleProps"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #default="{ active: valorized }">
      <ValorizedBadge :valorized />
    </template>
  </Toggle>
</template>
