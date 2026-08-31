<script lang="ts" setup>
import type { IconOptions } from '@/features/global/components/cards/FloatingIconCard/FloatingIconCard.vue'
import type { Slot } from 'vue'
import { FloatingIconCard } from '@/features/global'
import { type RouteLocationRaw, RouterLink } from 'vue-router'

export interface AssociationCardProps {
  title: string
  icon: string
  color: string
  backgroundColor: string
  hoverBorderColor?: string
  iconBorderColor?: string
  to: RouteLocationRaw
  disabled?: boolean
}

defineOptions({
  inheritAttrs: false
})

const { title, icon, color, backgroundColor, hoverBorderColor, iconBorderColor, to, disabled } = defineProps<AssociationCardProps>()

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
  <component
    :is="disabled ? 'div' : RouterLink"
    class="association-card av-w-full"
    :class="{ 'association-card--disabled': disabled }"
    v-bind="disabled ? {} : { to }"
    data-testid="association-card"
  >
    <FloatingIconCard
      v-bind="$attrs"
      :title="title"
      :icon-options="iconOptions"
      :color="backgroundColor"
      :title-color="color"
      border-color="var(--other-border-skill-card)"
      :border-color-on-hover="disabled ? 'transparent' : (hoverBorderColor ?? backgroundColor)"
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
  </component>
</template>

<style lang="scss" scoped>
@use '@avenirs-esr/avenirs-dsav/mixins' as dsav;

.association-card {
  @include dsav.min-width(md) {
    width: 21.625rem;
  }

  &--disabled {
    cursor: not-allowed;

    :deep(.av-card__title:hover) {
      cursor: not-allowed !important;
    }
  }
}
</style>
