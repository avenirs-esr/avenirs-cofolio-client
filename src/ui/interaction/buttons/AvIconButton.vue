<script setup lang="ts">
import type { AvIconButtonProps } from './types'
import AvButton from './AvButton.vue'

const props = withDefaults(defineProps<AvIconButtonProps>(), {
  label: '',
  variant: 'primary',
  size: 'md',
  icon: '',
  disabled: false,
  isLoading: false,
  onClick: () => {},
})
</script>

<template>
  <AvButton
    v-bind="props"
    icon-only
  />
</template>

<style lang="scss" scoped></style>
