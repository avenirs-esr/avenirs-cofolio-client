<script lang="ts" setup>
import type { Slot } from 'vue'
import type { AvCardProps } from './types'

const props = withDefaults(defineProps<AvCardProps>(), {
  borderColor: '--foreground-stroke',
  titleBackground: '--background-surface-background'
})

defineSlots<{
  title?: Slot
  body?: Slot
  footer?: Slot
  default?: Slot
}>()
</script>

<template>
  <div
    class="av-card"
    :style="{ borderColor: `var(${props.borderColor})` }"
  >
    <div
      v-if="$slots.title"
      class="av-card__title"
      :style="{ background: `var(${props.titleBackground})` }"
    >
      <slot name="title" />
    </div>
    <slot />
    <div
      v-if="$slots.body"
      class="av-card__body"
    >
      <slot name="body" />
    </div>
    <div
      v-if="$slots.footer"
      class="av-card__footer"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.av-card {
  display: flex;
  flex-direction: column;
  background-color: var(--background-card);
  border-radius: 1.5rem;
  border: 1px solid transparent;
  overflow: hidden;
  padding: 1rem;
  justify-content: space-between;

  &__title {
    margin: -1rem -1rem 1rem -1rem;
    padding: 1rem;
  }
}
</style>
