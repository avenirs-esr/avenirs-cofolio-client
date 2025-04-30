<script setup lang="ts">
import type { DownloadLinkProps } from './types'
import Link from './Link.vue'

const props = withDefaults(defineProps<DownloadLinkProps>(), {
  label: 'label',
  size: 'md',
  id: undefined,
  disabled: false,
  downloadDetail: undefined,
  downloadHreflang: undefined,
  downloadAssess: undefined,
})
</script>

<template>
  <Link
    v-bind="props"
    href="#"
    :has-icon="false"
    :external="false"
    :download="true"
  />
</template>

<style lang="scss" scoped></style>
