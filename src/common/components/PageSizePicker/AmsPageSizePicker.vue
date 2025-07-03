<script setup lang="ts">
import { useAmsStore } from '@/store'
import { AvPageSizePicker, type AvTagPickerOption } from '@/ui'
import { type PageSizes, pageSizeValues } from '@/ui/config'

const amsStore = useAmsStore()

function handleSelectChange (val: AvTagPickerOption): void {
  const numberVal = Number(val.value)
  if (pageSizeValues.includes(numberVal)) {
    amsStore.pageSizeSelected = numberVal as PageSizes
  }
}
</script>

<template>
  <AvPageSizePicker
    :page-size-selected="amsStore.pageSizeSelected"
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
