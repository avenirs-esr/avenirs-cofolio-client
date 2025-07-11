<script setup lang="ts">
import type { PageInfo } from '@/api/avenir-esr'
import type { Slot } from 'vue'
import { AvPageSizePicker, AvPagination, type AvTagPickerOption, getPaginationPages } from '@/ui'
import { type PageSizes, pageSizeValues } from '@/ui/config'
import { useI18n } from 'vue-i18n'

export interface PaginationProps {
  pageInfo: PageInfo
  pageSizeSelected: PageSizes
  onUpdateCurrentPage: (page: number) => void
  onUpdatePageSize: (pageSize: PageSizes) => void
}

const { pageInfo, pageSizeSelected, onUpdateCurrentPage, onUpdatePageSize } = defineProps<PaginationProps>()

defineSlots<{
  default?: Slot
}>()

const { t } = useI18n()

const totalPages = computed(() => pageInfo.totalPages)
const pages = computed(() => getPaginationPages(totalPages))

function handleSelectChange (val: AvTagPickerOption): void {
  const numberVal = Number(val.value)
  if (pageSizeValues.includes(numberVal)) {
    onUpdatePageSize(numberVal as PageSizes)
  }
}
</script>

<template>
  <div class="top-pagination-container">
    <AvPageSizePicker
      :label="t('global.pageSizePicker.label')"
      :page-size-selected="pageSizeSelected"
      :handle-select-change="handleSelectChange"
    />
    <AvPagination
      id="top-pagination"
      :current-page="pageInfo.number"
      :pages="pages"
      :aria-label="t('student.views.studentEducationAmsView.amsListContainer.pagination.top.ariaLabel')"
      compact
      @update:current-page="onUpdateCurrentPage"
    />
  </div>
  <slot />
  <div class="bottom-pagination-container">
    <AvPagination
      id="bottom-pagination"
      :current-page="pageInfo.number"
      :pages="pages"
      :aria-label="t('student.views.studentEducationAmsView.amsListContainer.pagination.bottom.ariaLabel')"
      @update:current-page="onUpdateCurrentPage"
    />
  </div>
</template>

<style lang="scss" scoped>
.top-pagination-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.bottom-pagination-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  padding-bottom: var(--spacing-lg);
}
</style>
