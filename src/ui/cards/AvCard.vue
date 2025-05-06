<script lang="ts" setup>
import type { AvCardProps } from './types'
import { defaultAvCardProps } from './defaults'

const props = withDefaults(defineProps<AvCardProps>(), defaultAvCardProps)
</script>

<template>
  <div
    class="av-card"
    :style="{ borderColor: props.borderColor, height: props.height, width: props.width }"
  >
    <div
      v-if="$slots.title"
      class="av-card__title"
      :style="{ background: props.titleBackground }"
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
  background-color: $background-card;
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
