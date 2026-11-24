<script lang="ts" setup>
import type { EToolType } from '#shared/api/avenir-esr/index'
import type { UsePaginatedAdminToolsParams } from '#shared/composables/use-paginated-admin-tools/use-paginated-admin-tools'
import { usePaginatedAdminTools } from '#shared/composables/use-paginated-admin-tools/use-paginated-admin-tools'
import { useAdminToolsStore } from '#shared/stores/index'
import ToolCard from '#shared/ui/components/cards/ToolCard/ToolCard.vue'
import QuerySuspense from '#shared/ui/components/containers/QuerySuspense/QuerySuspense.vue'
import Pagination from '#shared/ui/components/navigation/Pagination/Pagination.vue'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { computed, toRef, toRefs } from 'vue'

export interface AdminToolsPaginatedListProps {
  baseRouteName?: string
  type: EToolType | undefined
}

const props = defineProps<AdminToolsPaginatedListProps>()

const adminToolsStore = useAdminToolsStore()

const { baseRouteName, type } = toRefs(props)

const usePaginatedAdminToolsParams = computed<UsePaginatedAdminToolsParams>(() => ({
  currentPageRef: toRef(adminToolsStore, 'localToolsCurrentPage'),
  typeRef: type,
}))

const {
  tools,
  pageInfo,
  isFetching,
  error,
  onUpdateCurrentPage,
  onUpdatePageSize
} = usePaginatedAdminTools(usePaginatedAdminToolsParams.value)
</script>

<template>
  <QuerySuspense
    :is-loading="isFetching"
    :error="error"
    :is-empty="tools.length === 0 || !pageInfo"
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
          v-for="tool in tools"
          :key="tool.id"
          :tool="tool"
          :base-route-name="baseRouteName"
        />
      </div>
    </Pagination>
  </QuerySuspense>
</template>
