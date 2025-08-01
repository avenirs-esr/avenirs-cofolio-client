<script setup lang="ts">
import EsupLogoSvg from '@/assets/icons/esup-logo.svg'

const { width, height, color = 'var(--other-background-base)' } = defineProps<{
  width?: string
  height?: string
  color?: string
}>()

const svgProps = computed(() => ({
  ...(width && { width }),
  ...(height && { height })
}))
</script>

<template>
  <div class="svg-wrapper">
    <EsupLogoSvg
      v-bind="svgProps"
      class="logo"
    />
  </div>
</template>

<style lang="scss" scoped>
.svg-wrapper {
  padding: var(--spacing-xxxs);
  background: v-bind('color');
}

.logo {
  fill: currentColor;
}
</style>
