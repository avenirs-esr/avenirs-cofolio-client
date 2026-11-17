<script lang="ts" setup>
import type { AvInteractiveProps } from '@avenirs-esr/avenirs-dsav'
import type { IconOptions } from '@avenirs-esr/shared'
import type { EAssociationContextType } from '@avenirs-esr/shared/api/avenir-esr'
import type { Slot } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { COLORS, FloatingIconCard } from '@avenirs-esr/shared'
import { RouterLink } from 'vue-router'
import { ASSOCIATION_TYPE_ICONS } from '@/common/associations/constants/association-type.constants'

export interface AssociationCardProps extends AvInteractiveProps {
  title: string
  contextType: EAssociationContextType
  to: RouteLocationRaw
}

defineOptions({
  inheritAttrs: false
})

const { title, contextType, to, disabled } = defineProps<AssociationCardProps>()

defineSlots<{
  body?: Slot
  footer?: Slot
}>()

const iconOptions: IconOptions = {
  name: ASSOCIATION_TYPE_ICONS[contextType],
  color: 'var(--icon)',
  borderColor: 'var(--stroke)',
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
      :color="COLORS[contextType]"
      title-color="var(--text1)"
      border-color="var(--other-border-skill-card)"
      :border-color-on-hover="disabled ? 'transparent' : 'var(--dark-background-primary1)'"
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
