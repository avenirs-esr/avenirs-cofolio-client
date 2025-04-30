<!-- TODO: envisager d'utiliser router-link au lieu de a quand external === false -->

<script setup lang="ts">
import type { LinkProps } from './types'
import { computeIconClass, computeIconPlaceClass, computeSizeClass, DSFR } from '@/utils'
import { computed } from 'vue'

const props = withDefaults(defineProps<LinkProps>(), {
  label: 'label',
  size: 'md',
  href: '#',
  id: undefined,
  hasIcon: false,
  icon: undefined,
  iconPlace: undefined,
  disabled: false,
  external: false,
  download: undefined,
  downloadDetail: undefined,
  downloadHreflang: undefined,
  downloadAssess: undefined,
})

const {
  label,
  size,
  href,
  id,
  hasIcon,
  icon,
  iconPlace,
  external,
  disabled,
  download,
  downloadDetail,
  downloadHreflang,
  downloadAssess,
} = props

const sizeClass = computed(() => computeSizeClass(size, DSFR.LINK_PREFIX))
const target = computed(() => (external ? '_blank' : '_self'))
const rel = computed(() => (external ? 'noopener external' : undefined))
const title = computed(() => (external ? `${label} - nouvelle fenêtre` : undefined)) // TODO: intl
const downloadClass = computed(() => (download ? `${DSFR.LINK_PREFIX}--download` : undefined))
const downloadDetailClass = computed(() => (downloadDetail ? `${DSFR.LINK_PREFIX}__detail` : undefined))
const assess = computed(() => (downloadAssess ? 'data-fr-assess-file' : undefined))
const iconClass = computed(() => computeIconClass(hasIcon, icon))
const iconPlaceClass = computed(() => computeIconPlaceClass(hasIcon, icon, iconPlace, DSFR.LINK_PREFIX))
const role = computed(() => (disabled ? 'link' : undefined))
</script>

<template>
  <a
    :id="id"
    class="fr-link"
    :class="[sizeClass, downloadClass, iconClass, iconPlaceClass]"
    :title="title"
    :href="href"
    :target="target"
    :rel="rel"
    :aria-disabled="disabled"
    :role="role"
    :download="download"
    :hreflang="downloadHreflang"
    :data-fr-assess-file="assess"
  >{{ label }}<span
    v-if="downloadDetail"
    :class="downloadDetailClass"
  >{{ downloadDetail }}</span></a>
</template>

<style lang="scss" scoped></style>
