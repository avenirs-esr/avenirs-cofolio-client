<script lang="ts" setup>
import type { IconOptions } from '@/features/student/global/components/cards/FloatingIconCard/FloatingIconCard.vue'
import type { Slot } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { FloatingIconCard } from '@/features/student/global'

export interface AssociationCardProps {
  title: string
  icon: string
  color: string
  backgroundColor: string
  hoverBorderColor?: string
  iconBorderColor?: string
  to: RouteLocationRaw
}

const { title, icon, color, backgroundColor, hoverBorderColor, iconBorderColor, to } = defineProps<AssociationCardProps>()

defineSlots<{
  body?: Slot
  footer?: Slot
}>()

const iconOptions: IconOptions = {
  name: icon,
  color,
  borderColor: iconBorderColor ?? color,
  bottom: '-2.5rem',
}
</script>

<template>
  <RouterLink
    class="association-card av-w-full"
    :to="to"
    data-testid="association-card"
  >
    <FloatingIconCard
      :title="title"
      :icon-options="iconOptions"
      :color="backgroundColor"
      :title-color="color"
      border-color="var(--other-border-skill-card)"
      :border-color-on-hover="hoverBorderColor ?? backgroundColor"
      title-typography-classes="s2-regular"
      :header-rows="3"
      height="21.625rem"
    >
      <template #body>
        <slot name="body" />
      </template>
      <template #footer>
        <slot name="footer" />
      </template>
    </FloatingIconCard>
  </RouterLink>
</template>

<style lang="scss" scoped>
@use '@avenirs-esr/avenirs-dsav/mixins' as dsav;

.association-card {
  @include dsav.min-width(md) {
    width: 21.625rem;
  }
}
</style>
