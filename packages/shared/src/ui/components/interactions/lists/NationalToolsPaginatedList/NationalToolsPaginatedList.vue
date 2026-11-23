<script lang="ts" setup>
import type { UsePaginatedNationalToolsParams } from '#shared/composables/use-paginated-national-tools/use-paginated-national-tools'
import { usePaginatedNationalTools } from '#shared/composables/use-paginated-national-tools/use-paginated-national-tools'
import { useNationalToolsStore } from '#shared/stores/index'
import ToolCard from '#shared/ui/components/cards/ToolCard/ToolCard.vue'
import Pagination from '#shared/ui/components/navigation/Pagination/Pagination.vue'
import { QuerySuspense } from '#shared/ui/index'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { computed, toRef } from 'vue'

export interface NationalToolsPaginatedListProps {
  baseRouteName?: string
}

const { baseRouteName } = defineProps<NationalToolsPaginatedListProps>()

const nationalToolsStore = useNationalToolsStore()

const usePaginatedNationalToolsParams = computed<UsePaginatedNationalToolsParams>(() => ({
  currentPageRef: toRef(nationalToolsStore, 'nationalToolsCurrentPage'),
}))

const {
  nationalTools,
  pageInfo,
  isFetching,
  error,
  onUpdateCurrentPage,
  onUpdatePageSize
} = usePaginatedNationalTools(usePaginatedNationalToolsParams.value)
</script>

<template>
  <QuerySuspense
    :is-loading="isFetching"
    :error="error"
    :is-empty="nationalTools.length === 0 || !pageInfo"
  >
    <Pagination
      :page-info="pageInfo!"
      :page-size-selected="PageSizes.TWELVE"
      :on-update-current-page="onUpdateCurrentPage"
      :on-update-page-size="onUpdatePageSize"
      without-page-size-picker
    >
      <div class="av-row av-wrap av-gap-sm">
        <ToolCard
          v-for="tool in nationalTools"
          :key="tool.id"
          :tool="tool"
          :base-route-name="baseRouteName"
        />
      </div>
    </Pagination>
  </QuerySuspense>
</template>
