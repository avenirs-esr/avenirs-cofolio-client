<script setup lang="ts">
import type { ComputedRef } from 'vue'
import { PageSizes } from '@/config'
import { useI18n } from 'vue-i18n'
import AvTagPicker, { type AvTagPickerProps } from '../AvTagPicker/AvTagPicker.vue'

const { pageSizeSelected, handleSelectChange } = defineProps<{
  pageSizeSelected: PageSizes
  handleSelectChange: (val: string | number) => void
}>()
const { t } = useI18n()

const options: ComputedRef<number[]> = computed(() =>
  Object.values(PageSizes).filter(v => typeof v === 'number') as number[]
)
</script>

<template>
  <div class="pagination-size-picker-container">
    <AvTagPicker
      :options="options"
      :selected="pageSizeSelected"
      :handle-select-change="handleSelectChange as AvTagPickerProps['handleSelectChange']"
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
