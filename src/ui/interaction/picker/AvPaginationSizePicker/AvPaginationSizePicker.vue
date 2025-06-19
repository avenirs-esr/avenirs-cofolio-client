<script setup lang="ts">
import type { ComputedRef } from 'vue'
import { PageSizes } from '@/config'
import { type Store, storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import AvTagPicker, { type AvTagPickerProps } from '../AvTagPicker/AvTagPicker.vue'

type PageSizeStore = Store<string, { pageSizeSelected: PageSizes }, object, object>

const { store } = defineProps<{ store: PageSizeStore }>()
const { t } = useI18n()

const options: ComputedRef<number[]> = computed(() => [...Object.values(PageSizes)] as number[])
const { pageSizeSelected } = storeToRefs(store)

function handleSelectChange (val: string | number) {
  const numberVal = Number(val)
  if (Object.values(PageSizes).includes(numberVal)) {
    pageSizeSelected.value = numberVal as PageSizes
  }
}
</script>

<template>
  <div class="pagination-size-picker-container">
    <AvTagPicker
      :options="options"
      :selected="pageSizeSelected"
      :handle-select-change="handleSelectChange as AvTagPickerProps['handleSelectChange']"
      :multiple="false"
      :label="t('global.paginationSizePicker.label')"
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
