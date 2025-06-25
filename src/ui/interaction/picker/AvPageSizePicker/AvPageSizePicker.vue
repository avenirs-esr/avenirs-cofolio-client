<script setup lang="ts">
import type { ComputedRef } from 'vue'
import { PageSizes } from '@/config'
import AvTagPicker, { type AvTagPickerOption } from '@/ui/interaction/picker/AvTagPicker/AvTagPicker.vue'
import { useI18n } from 'vue-i18n'

const { pageSizeSelected, handleSelectChange } = defineProps<{
  pageSizeSelected: PageSizes
  handleSelectChange: (val: AvTagPickerOption) => void
}>()
const { t } = useI18n()

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
      :label="t('global.pageSizePicker.label')"
      label-typography-class="b2-regular"
      label-color="var(--foreground-text2)"
    />
  </div>
</template>

<style lang="scss" scoped>
.pagination-size-picker-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}
</style>
