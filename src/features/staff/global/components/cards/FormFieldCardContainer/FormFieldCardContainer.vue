<script setup lang="ts">
import type { Slot } from 'vue'
import Toggle from '@/common/components/Toggle/Toggle.vue'
import { AvCard, type AvCardProps, AvIconText } from '@avenirs-esr/avenirs-dsav'

export interface FormFieldCardContainerProps extends Pick<AvCardProps, 'collapsible' | 'collapsed' | 'titleOnly'> {
  title: string
  titleIcon: string
  backgroundColor?: 'var(--card2)' | 'var(--other-background-base)'
}

const {
  backgroundColor = 'var(--card2)',
  collapsible = false,
  collapsed = false,
  titleOnly = false
} = defineProps<FormFieldCardContainerProps>()

defineSlots<{
  title?: Slot
  default?: Slot
}>()

const model = defineModel<boolean>({
  default: true
})
</script>

<template>
  <AvCard
    :background-color="backgroundColor"
    :title-background="backgroundColor"
    border-color="var(--light-background-neutral)"
    :collapsible="collapsible"
    :collapsed="collapsed"
    :title-only="titleOnly"
  >
    <template #title>
      <div class="av-row av-w-full av-gap-md av-align-center av-justify-between">
        <AvIconText
          :icon="titleIcon"
          :text="title"
          icon-color="var(--dark-background-primary1)"
          text-color="var(--text1)"
          typography-class="s1-regular"
          gap="var(--spacing-xs)"
        />
        <Toggle
          v-model="model"
          description=""
        />
        <slot name="title" />
      </div>
    </template>

    <slot />
  </AvCard>
</template>
