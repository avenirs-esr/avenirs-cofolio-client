<script lang="ts" setup>
import type { AvHeaderProps } from './types'

const props = withDefaults(defineProps<AvHeaderProps>(), {
  customLogo: undefined,
  customLogoAlt: undefined,
  mainNav: undefined,
  showSearch: true,
  logoText: undefined,
  serviceTitle: undefined,
  serviceDescription: undefined,
  modelValue: undefined,
  placeholder: undefined,
  homeTo: '/',
  quickLinks: undefined,
  searchbarId: undefined,
  searchLabel: undefined,
  quickLinksAriaLabel: undefined,
  showSearchLabel: undefined,
})
</script>

<template>
  <DsfrHeader v-bind="props">
    <template
      v-if="mainNav"
      #mainnav
    >
      <component :is="mainNav" />
    </template>
    <slot />
  </DsfrHeader>
</template>

<style lang="scss" scoped></style>
