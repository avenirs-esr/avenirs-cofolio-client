<script setup lang="ts">
import type { ExternalLinkProps } from './types'
import Link from './Link.vue'

const props = withDefaults(defineProps<ExternalLinkProps>(), {
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
    :external="true"
  />
</template>

<style lang="scss" scoped></style>
