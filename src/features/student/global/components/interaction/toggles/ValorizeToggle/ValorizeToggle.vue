<script setup lang="ts">
import type { ComputedRef } from 'vue'
import type { ToggleProps } from '@/common/components/interaction/toggles/Toggle/Toggle.vue'
import { useAttrs } from 'vue'
import ValorizedBadge from '@/common/components/badges/ValorizedBadge/ValorizedBadge.vue'
import Toggle from '@/common/components/interaction/toggles/Toggle/Toggle.vue'

export interface ValorizeToggleProps extends Omit<ToggleProps, 'activeText' | 'inactiveText' | 'statusTextWidth'> { }

const props = defineProps<ValorizeToggleProps>()

const attrs = useAttrs()

const toggleProps: ComputedRef<ToggleProps> = computed(() => ({
  ...attrs,
  ...props,
  statusTextWidth: 'fit-content',
}))
</script>

<template>
  <Toggle v-bind="toggleProps">
    <template #default="{ active }">
      <ValorizedBadge :valorized="active" />
    </template>
  </Toggle>
</template>
