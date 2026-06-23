<script setup lang="ts">
import type { Slot } from 'vue'
import Toggle from '@/common/components/Toggle/Toggle.vue'
import IconTitleCardContainer from '@/features/staff/global/components/cards/IconTitleCardContainer/IconTitleCardContainer.vue'

export interface ToggleParameterCardProps {
  title: string
  icon: string
  disabled?: boolean
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
      />
    </template>

    <slot />
  </IconTitleCardContainer>
</template>
