<script setup lang="ts">
import { useAmsPaginationSizePicker } from '@/store'
import { AvPaginationSizePicker } from '@/ui'

const amsPaginationSizePickerStore = useAmsPaginationSizePicker()
</script>

<template>
  <AvPaginationSizePicker :store="amsPaginationSizePickerStore" />
</template>

<style lang="scss" scoped>
.trace-page-size-select-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}
</style>
