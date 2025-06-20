<script setup lang="ts">
import { useAmsPageSizePicker } from '@/store'
import { AvPageSizePicker } from '@/ui'

const amsPageSizePickerStore = useAmsPageSizePicker()
</script>

<template>
  <AvPageSizePicker :store="amsPageSizePickerStore" />
</template>

<style lang="scss" scoped>
.trace-page-size-select-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}
</style>
