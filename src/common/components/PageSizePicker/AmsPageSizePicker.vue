<script setup lang="ts">
import { PageSizes } from '@/config'
import { useAmsStore } from '@/store'
import { AvPageSizePicker } from '@/ui'

const amsStore = useAmsStore()

function handleSelectChange (val: string | number) {
  const numberVal = Number(val)
  if (Object.values(PageSizes).includes(numberVal)) {
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
