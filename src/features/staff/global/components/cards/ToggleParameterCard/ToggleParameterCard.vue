<script setup lang="ts">
import type { AvInteractiveProps } from '@avenirs-esr/avenirs-dsav'
import type { Slot } from 'vue'
import IconTitleCardContainer from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.vue'
import Toggle from '@/common/components/Toggle/Toggle.vue'

export interface ToggleParameterCardProps extends AvInteractiveProps {
  title: string
  icon: string
  toggleId?: string
}

const { title, icon, disabled = false, toggleId } = defineProps<ToggleParameterCardProps>()
defineSlots<{
  default?: Slot
}>()

const model = defineModel<boolean>({ default: true })
</script>

<template>
  <IconTitleCardContainer
    :title="title"
    :title-icon="icon"
    background-color="var(--other-background-base)"
    data-testid="toggle-parameter-card"
  >
    <template #title>
      <Toggle
        :id="toggleId"
        v-model="model"
        description=""
        :disabled="disabled"
        :disabled-tooltip="disabledTooltip"
      />
    </template>

    <slot />
  </IconTitleCardContainer>
</template>
