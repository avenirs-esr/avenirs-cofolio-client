<script setup lang="ts">
import type { PageInfoDTO } from '@/api/avenir-esr'
import type { Slot } from 'vue'
import {
  AvPageSizePicker,
  AvPagination,
  type AvTagPickerOption,
  getPaginationPages,
  type PageSizes,
  pageSizeValues,
  useAvBreakpoints
} from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface PaginationProps {
  pageInfo: PageInfoDTO
  pageSizeSelected: PageSizes
  onUpdateCurrentPage: (page: number) => void
  onUpdatePageSize: (pageSize: PageSizes) => void
}

const { pageInfo, pageSizeSelected, onUpdateCurrentPage, onUpdatePageSize } = defineProps<PaginationProps>()

defineSlots<{
  default?: Slot
}>()

const { isMobile } = useAvBreakpoints()

const { t } = useI18n()

const totalPages = computed(() => pageInfo.totalPages)
const pages = computed(() => getPaginationPages(totalPages))
const truncLimit = computed(() => isMobile.value ? 1 : undefined)

function handleSelectChange (val: AvTagPickerOption): void {
  const numberVal = Number(val.value)
  if (pageSizeValues.includes(numberVal)) {
    onUpdatePageSize(numberVal as PageSizes)
  }
}
</script>

<template>
  <div class="av-row av-wrap av-align-center av-justify-between av-gap-md">
    <AvPageSizePicker
      v-if="!isMobile && totalPages > 0"
      :label="t('global.pageSizePicker.label')"
      :page-size-selected="pageSizeSelected"
      :handle-select-change="handleSelectChange"
    />
    <AvPagination
      id="top-pagination"
      :current-page="pageInfo.page"
      :pages="pages"
      :aria-label="t('global.avPagination.topAriaLabel')"
      compact
      :prev-page-label="t('global.avPagination.prevPageTitle')"
      :next-page-label="t('global.avPagination.nextPageTitle')"
      :compact-current-page-label="t('global.avPagination.current', {
        current: (pageInfo.page + 1),
        total: (pageInfo.totalPages),
      })"
      @update:current-page="onUpdateCurrentPage"
    />
  </div>
  <slot />
  <div class="av-row av-w-full av-justify-center av-pb-lg">
    <AvPagination
      id="bottom-pagination"
      :current-page="pageInfo.page"
      :pages="pages"
      :aria-label="t('global.avPagination.bottomAriaLabel')"
      :first-page-label="t('global.avPagination.firstPageTitle')"
      :prev-page-label="t('global.avPagination.prevPageTitle')"
      :next-page-label="t('global.avPagination.nextPageTitle')"
      :last-page-label="t('global.avPagination.lastPageTitle')"
      :trunc-limit="truncLimit"
      @update:current-page="onUpdateCurrentPage"
    />
  </div>
</template>
