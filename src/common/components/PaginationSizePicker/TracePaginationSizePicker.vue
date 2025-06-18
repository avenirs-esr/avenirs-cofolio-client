<script setup lang="ts">
import { useTracePaginationSizePicker } from '@/store'
import { AvPaginationSizePicker } from '@/ui'

const tracePaginationSizePickerStore = useTracePaginationSizePicker()
</script>

<template>
  <AvPaginationSizePicker :store="tracePaginationSizePickerStore" />
</template>

<style lang="scss" scoped>
.trace-page-size-select-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}
</style>
