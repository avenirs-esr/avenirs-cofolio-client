<script setup lang="ts">
import { useTracesStore } from '@/store'
import { AvPageSizePicker, type AvTagPickerOption } from '@/ui'
import { type PageSizes, pageSizeValues } from '@/ui/config'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
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
    :label="t('global.pageSizePicker.label')"
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
