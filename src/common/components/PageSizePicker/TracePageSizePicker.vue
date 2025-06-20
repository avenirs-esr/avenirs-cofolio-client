<script setup lang="ts">
import { useTracePageSizePicker } from '@/store'
import { AvPageSizePicker } from '@/ui'

const tracePageSizePickerStore = useTracePageSizePicker()
</script>

<template>
  <AvPageSizePicker :store="tracePageSizePickerStore" />
</template>

<style lang="scss" scoped>
.trace-page-size-select-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}
</style>
