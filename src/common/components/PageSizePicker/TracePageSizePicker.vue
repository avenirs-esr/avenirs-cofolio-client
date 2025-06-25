<script setup lang="ts">
import { type PageSizes, pageSizeValues } from '@/config'
import { useTracesStore } from '@/store'
import { AvPageSizePicker, type AvTagPickerOption } from '@/ui'

const tracesStore = useTracesStore()

function handleSelectChange (val: AvTagPickerOption): void {
  const numberVal = Number(val.value)
  if (pageSizeValues.includes(numberVal)) {
    tracesStore.pageSizeSelected = numberVal as PageSizes
  }
}
</script>

<template>
  <AvPageSizePicker
    :page-size-selected="tracesStore.pageSizeSelected"
    :handle-select-change="handleSelectChange"
  />
</template>

<style lang="scss" scoped>
.trace-page-size-select-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}
</style>
