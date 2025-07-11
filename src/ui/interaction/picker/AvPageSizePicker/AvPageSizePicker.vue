<script setup lang="ts">
import type { ComputedRef } from 'vue'
import { PageSizes } from '@/ui/config'
import AvTagPicker, { type AvTagPickerOption } from '@/ui/interaction/picker/AvTagPicker/AvTagPicker.vue'

/**
 * AvPageSizePicker component props.
 */
export interface AvPageSizePickerProps {
  /**
   * Label of the page size picker.
   */
  label: string

  /**
   * Number of results per page selected.
   */
  pageSizeSelected: PageSizes

  /**
   * Method executed when changing selection.
   *
   * @param val Selected option of type AvTagPickerOption.
   */
  handleSelectChange: (val: AvTagPickerOption) => void
}

const { label, pageSizeSelected, handleSelectChange } = defineProps<AvPageSizePickerProps>()

const options: ComputedRef<AvTagPickerOption[]> = computed(() => Object.values(PageSizes)
  .filter(value => typeof value === 'number')
  .map(pageNumber => ({
    label: pageNumber.toString(),
    value: pageNumber.toString()
  })))

const selectedOption: ComputedRef<AvTagPickerOption> = computed(() => ({
  label: pageSizeSelected.toString(),
  value: pageSizeSelected.toString()
}))
</script>

<template>
  <div class="pagination-size-picker-container">
    <AvTagPicker
      :options="options"
      :selected="selectedOption"
      :handle-select-change="handleSelectChange"
      :multiple="false"
      :label="label"
      label-typography-class="b2-regular"
      label-color="var(--text2)"
    />
  </div>
</template>

<style lang="scss" scoped>
.pagination-size-picker-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--spacing-xs);
}
</style>
