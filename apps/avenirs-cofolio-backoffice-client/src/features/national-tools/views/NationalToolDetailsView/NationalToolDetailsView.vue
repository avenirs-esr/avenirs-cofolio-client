<script setup lang="ts">
import { DetailPageTitle, ManageToolDropdown, ToolDetailsContainer } from '@avenirs-esr/shared'
import { useGetNationalTool } from '@avenirs-esr/shared/api/avenir-esr'
import { useRouter } from 'vue-router'
import { ROUTES } from '@/constants'

export interface NationalToolDetailsViewProps {
  id: string
}

const { id } = defineProps<NationalToolDetailsViewProps>()

const router = useRouter()

const toolId = computed(() => id)

const { data: tool, isLoading } = useGetNationalTool(toolId)

const trailingLinks = computed(() => [{ text: tool.value?.name ?? '' }])

function onToolDeleted () {
  router.replace(ROUTES.NATIONAL_TOOLS)
}
</script>

<template>
  <DetailPageTitle
    :title="tool?.name ?? ''"
    :trailing-links="trailingLinks"
  >
    <template #actions>
      <ManageToolDropdown
        v-if="tool"
        :tool="tool"
        :is-loading="isLoading"
        @deleted="onToolDeleted"
      />
    </template>
  </DetailPageTitle>
  <ToolDetailsContainer
    :id="id"
    is-national
  />
</template>
