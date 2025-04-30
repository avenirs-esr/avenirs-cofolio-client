<script setup lang="ts">
import type { TextLinkProps } from './types'
import Link from './Link.vue'

const props = withDefaults(defineProps<TextLinkProps>(), {
  label: 'label',
  size: 'md',
  href: '#',
  id: undefined,
  disabled: false,
})
</script>

<template>
  <Link
    v-bind="props"
    :has-icon="false"
    :external="false"
  />
</template>

<style lang="scss" scoped></style>
