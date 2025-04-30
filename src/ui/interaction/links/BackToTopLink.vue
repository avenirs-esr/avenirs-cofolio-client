<script setup lang="ts">
import type { BackToTopLinkProps } from './types'
import { DSFR_ICONS } from '@/utils'
import { computed } from 'vue'
import Link from './Link.vue'

const props = withDefaults(defineProps<BackToTopLinkProps>(), {
  size: 'md',
  id: undefined,
  disabled: false,
})

const label = computed(() => 'Haut de page') // TODO: intl
const icon = computed(() => DSFR_ICONS.UP_ARROW_FILL)
</script>

<template>
  <Link
    v-bind="props"
    :label="label"
    href="#top"
    :has-icon="true"
    :icon="icon"
    icon-place="left"
    :external="false"
  />
</template>

<style lang="scss" scoped></style>
