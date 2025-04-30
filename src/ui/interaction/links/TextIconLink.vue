<script setup lang="ts">
import type { TextIconLinkProps } from './types'
import { DSFR_ICONS } from '@/utils'
import Link from './Link.vue'

const props = withDefaults(defineProps<TextIconLinkProps>(), {
  label: 'label',
  icon: `${DSFR_ICONS.RIGHT_ARROW}`,
  iconPlace: 'left',
  size: 'md',
  href: '#',
  id: undefined,
  disabled: false,
})
</script>

<template>
  <Link
    v-bind="props"
    :has-icon="true"
    :external="false"
  />
</template>

<style lang="scss" scoped></style>
