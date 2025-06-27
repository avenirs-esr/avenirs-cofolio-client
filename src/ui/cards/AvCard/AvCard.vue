<script lang="ts" setup>
import type { Slot } from 'vue'

export interface AvCardProps {
  backgroundColor?: string
  borderColor?: string
  titleBackground?: string
  titleHeight?: string
}

const {
  backgroundColor = '--card',
  borderColor = '--stroke',
  titleBackground = '--surface-background',
  titleHeight,
} = defineProps<AvCardProps>()

const slots = defineSlots<{
  title?: Slot
  body?: Slot
  footer?: Slot
  default?: Slot
}>()
</script>

<template>
  <div
    class="av-card"
    :style="{ borderColor: `var(${borderColor})`, background: `var(${backgroundColor})` }"
  >
    <div
      v-if="slots.title"
      class="av-card__title"
      :style="{ background: `var(${titleBackground})`, height: titleHeight }"
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
