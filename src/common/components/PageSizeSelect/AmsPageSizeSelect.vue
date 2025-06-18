<script setup lang="ts">
import { PAGE_SIZES, type PageSize } from '@/config'
import { useAmsPageSizeSelect } from '@/store'
import { AvSelect, type AvSelectProps } from '@/ui'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const options = computed(() => [...PAGE_SIZES])
const amsPageSizeSelectStore = useAmsPageSizeSelect()
const { pageSizeSelected } = storeToRefs(amsPageSizeSelectStore)

function handleSelectChange (val: string | number) {
  const numberVal = Number(val)
  if (PAGE_SIZES.includes(numberVal as PageSize)) {
    pageSizeSelected.value = numberVal as PageSize
  }
}
</script>

<template>
  <div class="ams-page-size-select-container">
    <AvSelect
      :options="options"
      :selected="pageSizeSelected"
      :handle-select-change="handleSelectChange as AvSelectProps['handleSelectChange']"
      :multiple="false"
      :label="t('global.pageSizeSelect.label')"
      label-typography-class="b2-regular"
      label-color="var(--foreground-text2)"
    />
  </div>
</template>

<style lang="scss" scoped>
.ams-page-size-select-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}
</style>
