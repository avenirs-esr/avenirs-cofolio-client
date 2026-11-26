<script lang="ts" setup>
import type { UsePaginatedToolsParams } from '#shared/composables/use-paginated-tools/use-paginated-tools'
import { EToolType } from '#shared/api/avenir-esr/index'
import { usePaginatedTools } from '#shared/composables/use-paginated-tools/use-paginated-tools'
import { useToolsStore } from '#shared/stores/index'
import ToolCard from '#shared/ui/components/cards/ToolCard/ToolCard.vue'
import QuerySuspense from '#shared/ui/components/containers/QuerySuspense/QuerySuspense.vue'
import Pagination from '#shared/ui/components/navigation/Pagination/Pagination.vue'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { computed, toRef, toRefs } from 'vue'

export interface ToolsPaginatedListProps {
  baseRouteName?: string
  type: EToolType
}

const props = defineProps<ToolsPaginatedListProps>()

const toolsStore = useToolsStore()

const { baseRouteName, type } = toRefs(props)

const currentPageRef = computed(() => {
  switch (type.value) {
    case EToolType.NATIONAL:
      return toRef(toolsStore, 'nationalToolsCurrentPage')
    case EToolType.REGIONAL:
      return toRef(toolsStore, 'regionalToolsCurrentPage')
    default:
      return toRef(toolsStore, 'localToolsCurrentPage')
  }
})

const isPreviewMode = computed(() => !baseRouteName.value)

const usePaginatedToolsParams = computed<UsePaginatedToolsParams>(() => ({
  currentPageRef: currentPageRef.value,
  typeRef: type,
  previewModeRef: isPreviewMode,
}))

const {
  tools,
  pageInfo,
  isFetching,
  error,
  onUpdateCurrentPage,
  onUpdatePageSize
} = usePaginatedTools(usePaginatedToolsParams.value)
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
