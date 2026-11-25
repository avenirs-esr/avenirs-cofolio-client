<script setup lang="ts">
import { DetailPageTitle, ToolDetailsContainer } from '@avenirs-esr/shared'
import { useGetNationalTool } from '@avenirs-esr/shared/api/avenir-esr'

export interface NationalToolDetailsViewProps {
  id: string
}

const { id } = defineProps<NationalToolDetailsViewProps>()

const toolId = computed(() => id)

const { data: tool } = useGetNationalTool(toolId)

const trailingLinks = computed(() => [{ text: tool.value?.name ?? '' }])
</script>

<template>
  <DetailPageTitle
    :title="tool?.name ?? ''"
    :trailing-links="trailingLinks"
  />
  <ToolDetailsContainer
    :id="id"
    :is-national="true"
  />
</template>
