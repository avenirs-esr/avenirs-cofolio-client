<script setup lang="ts">
import { DetailPageTitle, ToolDetailsContainer } from '@avenirs-esr/shared'
import { useGetLocalTool, useGetNationalTool } from '@avenirs-esr/shared/api/avenir-esr'
import { useIdentifyRoute } from '@/common/composables/use-identify-route/use-identitfy-route'

export interface NationalToolDetailsViewProps {
  id: string
}

const { id } = defineProps<NationalToolDetailsViewProps>()

const { isStaffAdminNationalToolRoute: isNational } = useIdentifyRoute()

const toolId = computed(() => id)

const { data: nationalTool } = useGetNationalTool(toolId, { query: { enabled: isNational } })
const { data: localTool } = useGetLocalTool(toolId, { query: { enabled: computed(() => !isNational) } })

const tool = computed(() => isNational.value ? nationalTool.value : localTool.value)

const trailingLinks = computed(() => [{ text: tool.value?.name ?? '' }])
</script>

<template>
  <DetailPageTitle
    :title="tool?.name ?? ''"
    :trailing-links="trailingLinks"
  />
  <ToolDetailsContainer
    :id="id"
    :is-national="isNational"
  />
</template>
