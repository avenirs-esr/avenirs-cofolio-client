<script setup lang="ts">
import type { Slot } from 'vue'
import Card, { type CardProps } from '@/common/components/cards/Card/Card.vue'
import { AvIconText } from '@avenirs-esr/avenirs-dsav'

export interface IconTitleCardContainerProps extends Pick<CardProps, 'collapsible' | 'collapsed' | 'titleOnly'> {
  title: string
  titleIcon: string
  required?: boolean
  backgroundColor?: 'var(--card2)' | 'var(--other-background-base)'
}

const {
  required = false,
  backgroundColor = 'var(--card2)',
  collapsible = false,
  collapsed = false,
  titleOnly = false
} = defineProps<IconTitleCardContainerProps>()

defineSlots<{
  title?: Slot
  default?: Slot
}>()
</script>

<template>
  <Card
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
          :text="required ? `${title} *` : title"
          icon-color="var(--dark-background-primary1)"
          text-color="var(--text1)"
          typography-class="s1-regular"
          gap="var(--spacing-xs)"
          inline
        />
        <slot name="title" />
      </div>
    </template>

    <slot />
  </Card>
</template>
