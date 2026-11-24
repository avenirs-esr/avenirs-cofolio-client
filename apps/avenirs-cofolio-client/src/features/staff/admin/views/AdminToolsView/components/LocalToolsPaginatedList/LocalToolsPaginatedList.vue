<script lang="ts" setup>
import type { UsePaginatedLocalToolsParams } from '@/features/staff/admin/views/AdminToolsView/composables/use-paginated-local-tools/use-paginated-local-tools'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { Pagination, QuerySuspense, ToolCard } from '@avenirs-esr/shared'
import { EToolType } from '@avenirs-esr/shared/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import { useLocalToolsStore } from '@/features/staff/admin/stores/local-tools/local-tools.store'
import { usePaginatedLocalTools } from '@/features/staff/admin/views/AdminToolsView/composables/use-paginated-local-tools/use-paginated-local-tools'

export interface LocalToolsPaginatedListProps {
  type: EToolType
}

const props = defineProps<LocalToolsPaginatedListProps>()

const { type } = toRefs(props)

const localToolsStore = useLocalToolsStore()

const usePaginatedLocalToolsParams = computed<UsePaginatedLocalToolsParams>(() => ({
  currentPageRef: toRef(localToolsStore, type.value === EToolType.LOCAL ? 'localToolsCurrentPage' : 'regionalToolsCurrentPage'),
  typeRef: type
}))

const {
  localTools,
  pageInfo,
  isFetching,
  error,
  onUpdateCurrentPage,
  onUpdatePageSize
} = usePaginatedLocalTools(usePaginatedLocalToolsParams.value)
</script>

<template>
  <QuerySuspense
    :is-loading="isFetching"
    :error="error"
    :is-empty="localTools.length === 0 || !pageInfo"
    preserve-content
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
          v-for="tool in localTools"
          :key="tool.id"
          :tool="tool"
          :base-route-name="ROUTES.STAFF.ADMIN.TOOL.name"
        />
      </div>
    </Pagination>
  </QuerySuspense>
</template>
