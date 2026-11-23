<script setup lang="ts">
import type { AvTagPickerOption, PageSizes } from '@avenirs-esr/avenirs-dsav'
import type { PageInfoDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { Slot } from 'vue'
import {
  AvPageSizePicker,
  AvPagination,

  getPaginationPages,

  pageSizeValues,
  useAvBreakpoints
} from '@avenirs-esr/avenirs-dsav'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export interface PaginationProps {
  pageInfo: PageInfoDTO
  pageSizeSelected: PageSizes
  withoutPageSizePicker?: boolean
  onUpdateCurrentPage: (page: number) => void
  onUpdatePageSize: (pageSize: PageSizes) => void
}

const { pageInfo, pageSizeSelected, withoutPageSizePicker = false, onUpdateCurrentPage, onUpdatePageSize } = defineProps<PaginationProps>()

defineSlots<{
  default?: Slot
}>()

const { isMobile } = useAvBreakpoints()

const { t } = useI18n()

const totalPages = computed(() => pageInfo.totalPages)
const pages = computed(() => getPaginationPages(totalPages))
const truncLimit = computed(() => isMobile.value ? 1 : undefined)

const paginationKey = 'global.components.navigation.Pagination'

function handleSelectChange (val: AvTagPickerOption): void {
  const numberVal = Number(val.value)
  if (pageSizeValues.includes(numberVal)) {
    onUpdatePageSize(numberVal as PageSizes)
  }
}
</script>

<template>
  <div
    class="pagination"
    data-testid="pagination"
  >
    <div
      class="av-row av-wrap av-align-center av-gap-md"
      :class="{
        'av-justify-end': withoutPageSizePicker,
        'av-justify-between': !withoutPageSizePicker,
      }"
    >
      <AvPageSizePicker
        v-if="totalPages > 0 && !withoutPageSizePicker"
        data-testid="page-size-picker"
        :label="t('global.pageSizePicker.label')"
        :page-size-selected="pageSizeSelected"
        :handle-select-change="handleSelectChange"
      />
      <AvPagination
        id="top-pagination"
        :current-page="pageInfo.page"
        :pages="pages"
        :aria-label="t(`${paginationKey}.topAriaLabel`)"
        compact
        :prev-page-disabled-tooltip="t(`${paginationKey}.prevPageDisabledTooltip`)"
        :prev-page-label="t(`${paginationKey}.prevPageTitle`)"
        :next-page-disabled-tooltip="t(`${paginationKey}.nextPageDisabledTooltip`)"
        :next-page-label="t(`${paginationKey}.nextPageTitle`)"
        :compact-current-page-label="t(`${paginationKey}.current`, {
          current: (pageInfo.page + 1),
          total: (pageInfo.totalPages),
        })"
        @update:current-page="onUpdateCurrentPage"
      />
    </div>
    <div class="av-py-md">
      <slot />
    </div>
    <div class="av-row av-w-full av-justify-center av-pb-lg">
      <AvPagination
        id="bottom-pagination"
        :current-page="pageInfo.page"
        :pages="pages"
        :aria-label="t(`${paginationKey}.bottomAriaLabel`)"
        :first-page-disabled-tooltip="t(`${paginationKey}.firstPageDisabledTooltip`)"
        :first-page-label="t(`${paginationKey}.firstPageTitle`)"
        :prev-page-disabled-tooltip="t(`${paginationKey}.prevPageDisabledTooltip`)"
        :prev-page-label="t(`${paginationKey}.prevPageTitle`)"
        :next-page-disabled-tooltip="t(`${paginationKey}.nextPageDisabledTooltip`)"
        :next-page-label="t(`${paginationKey}.nextPageTitle`)"
        :last-page-disabled-tooltip="t(`${paginationKey}.lastPageDisabledTooltip`)"
        :last-page-label="t(`${paginationKey}.lastPageTitle`)"
        :trunc-limit="truncLimit"
        @update:current-page="onUpdateCurrentPage"
      />
    </div>
  </div>
</template>
