<script lang="ts" setup>
import type { Slot } from 'vue'

defineSlots<{
  title?: Slot
  default?: Slot
}>()
</script>

<template>
  <div class="av-col av-flex-fill av-gap-md">
    <div class="av-row--lg av-align-start--lg av-justify-end--lg av-gap-sm av-pb-md">
      <slot name="title" />
    </div>

    <slot />
  </div>
</template>
