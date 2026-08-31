<script lang="ts" setup>
import type { IdTitle } from '@/types'
import FloatingIconCard from '@/features/global/components/cards/FloatingIconCard/FloatingIconCard.vue'

export interface CompactCardProps {
  element: IdTitle
  icon: string
  color?: string
  iconColor?: string
  backgroundColor?: string
  borderColor?: string
  iconBorderColor?: string
  iconBottom?: string
}
const {
  element,
  icon,
  color = 'var(--text1)',
  iconColor = 'var(--icon)',
  backgroundColor = 'var(--surface-background)',
  borderColor = 'var(--other-border-skill-card)',
  iconBorderColor = 'var(--other-border-skill-card)',
  iconBottom = '-2rem',
} = defineProps<CompactCardProps>()

const iconOptions = computed(() => ({
  name: icon,
  color: iconColor,
  bottom: iconBottom,
  borderColor: iconBorderColor,
}))
</script>

<template>
  <FloatingIconCard
    :title="element.title"
    :icon-options="iconOptions"
    :header-rows="2"
    height="5.75rem"
    custom-title-height="3.25rem"
    :border-color="borderColor"
    :color="backgroundColor"
    :title-color="color"
    title-typography-classes="caption-regular"
    data-testid="compact-card"
  >
    <template #body>
      <slot />
    </template>
  </FloatingIconCard>
</template>

<style lang="scss" scoped>
.floating-icon-card {
  min-width: 13.4375rem !important;
  max-width: 13.4375rem !important;
}

:deep() {
  .floating-icon-card {
    &__title {
      text-align: left;
      margin-right: var(--spacing-lg) !important;
    }

    &__icon {
      height: var(--dimension-lg);
      width: var(--dimension-lg);
    }
  }

  .av-icon {
    scale: 0.75 !important;
  }

  .av-card {
    padding: var(--spacing-xxs) !important;
    border-radius: var(--radius-lg) !important;

    &__content-collapsible {
      padding-top: var(--spacing-xxs) !important;
    }
  }
}
</style>
