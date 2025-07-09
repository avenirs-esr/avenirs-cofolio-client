<script lang="ts" setup>
import type { Slot } from 'vue'

/**
 * AvCard component props.
 */
export interface AvCardProps {
  /**
   * The background color of the card.
   * @default 'var(--card)'
   */
  backgroundColor?: string

  /**
   * The border color of the card.
   * @default 'var(--stroke)'
   */
  borderColor?: string

  /**
   * The background color of the card title.
   * @default 'var(--surface-background)'
   */
  titleBackground?: string

  /**
   * The height of the card title.
   */
  titleHeight?: string
}

const {
  backgroundColor = 'var(--card)',
  borderColor = 'var(--stroke)',
  titleBackground = 'var(--surface-background)',
  titleHeight,
} = defineProps<AvCardProps>()

/**
 * Slots available in the AvCard component.
 *
 * @slot title - Slot for the card title.
 * @slot body - Slot for the card body.
 * @slot footer - Slot for card footer.
 * @slot default - Default slot for global content.
 */
const slots = defineSlots<{
  /**
   * Slot for the card title.
   */
  title?: Slot

  /**
   * Slot for the card body.
   */
  body?: Slot

  /**
   * Slot for the card footer.
   */
  footer?: Slot

  /**
   * Default slot for global content.
   */
  default?: Slot
}>()
</script>

<template>
  <div
    class="av-card"
    :style="{ borderColor, background: backgroundColor }"
  >
    <div
      v-if="slots.title"
      class="av-card__title"
      :style="{ background: titleBackground, height: titleHeight }"
    >
      <slot name="title" />
    </div>
    <slot />
    <div
      v-if="slots.body"
      class="av-card__body"
    >
      <slot name="body" />
    </div>
    <div
      v-if="slots.footer"
      class="av-card__footer"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.fr-card {
  background-image: none !important;
}

.av-card {
  display: flex;
  flex-direction: column;
  border-radius: 1.5rem;
  border: 1px solid transparent;
  overflow: hidden;
  padding: 1rem;
  justify-content: space-between;

  &__title {
    margin: -1rem -1rem 0 -1rem;
    padding: 1rem;
  }
}
</style>
