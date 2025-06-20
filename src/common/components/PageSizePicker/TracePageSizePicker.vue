<script setup lang="ts">
import { PageSizes } from '@/config'
import { useTracesStore } from '@/store'
import { AvPageSizePicker } from '@/ui'

const tracesStore = useTracesStore()

function handleSelectChange (val: string | number) {
  const numberVal = Number(val)
  if (Object.values(PageSizes).includes(numberVal)) {
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
