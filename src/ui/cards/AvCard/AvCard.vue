<script lang="ts" setup>
import type { Slot } from 'vue'

/**
 * Props du composant AvCard.
 */
export interface AvCardProps {
  /**
   * La couleur de fond de la carte.
   * @default 'var(--card)'
   */
  backgroundColor?: string

  /**
   * La couleur de bordure de la carte.
   * @default 'var(--stroke)'
   */
  borderColor?: string

  /**
   * La couleur de fond du titre de la carte.
   * @default 'var(--surface-background)'
   */
  titleBackground?: string

  /**
   * La hauteur du titre de la carte.
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
 * Slots disponibles dans le composant AvCard.
 *
 * @slot title - Slot pour le titre de la carte.
 * @slot body - Slot pour le corps de la carte.
 * @slot footer - Slot pour le bas de la carte.
 * @slot default - Slot par défaut pour du contenu global.
 */
const slots = defineSlots<{
  /**
   * Slot pour le titre de la carte.
   */
  title?: Slot

  /**
   * Slot pour le corps de la carte.
   */
  body?: Slot

  /**
   * Slot pour le bas de la carte.
   */
  footer?: Slot

  /**
   * Slot par défaut pour du contenu global.
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
