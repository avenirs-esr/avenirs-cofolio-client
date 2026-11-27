<script setup lang="ts">
import { DetailPageTitle, ManageToolDropdown, ToolDetailsContainer } from '@avenirs-esr/shared'
import { EToolType, useGetLocalTool, useGetNationalTool } from '@avenirs-esr/shared/api/avenir-esr'
import { useI18n } from 'vue-i18n'
import { useNavigation } from '@/common/composables'
import { useIdentifyRoute } from '@/common/composables/use-identify-route/use-identitfy-route'

export interface NationalToolDetailsViewProps {
  id: string
}

const { id } = defineProps<NationalToolDetailsViewProps>()

const { t } = useI18n()
const { navigateToStaffAdminTools } = useNavigation()
const { isStaffAdminNationalToolRoute: isNational } = useIdentifyRoute()

const toolId = computed(() => id)

const { data: nationalTool, isFetching: isFetchingNationalTool } = useGetNationalTool(toolId, { query: { enabled: isNational } })
const { data: localTool, isFetching: isFetchingLocalTool } = useGetLocalTool(toolId, { query: { enabled: computed(() => !isNational.value) } })

const tool = computed(() => isNational.value ? nationalTool.value : localTool.value)

const isLoading = computed(() => isFetchingNationalTool.value || isFetchingLocalTool.value)

const trailingLinks = computed(() => [{ text: tool.value?.name ?? '' }])

function onToolDeleted () {
  navigateToStaffAdminTools(true)
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
        :disabled="tool.type === EToolType.NATIONAL"
        :disabled-tooltip="t('staff.admin.tools.manageNationalDisabledTooltip')"
        @deleted="onToolDeleted"
      />
    </template>
  </DetailPageTitle>
  <ToolDetailsContainer
    :id="id"
    :is-national="isNational"
  />
</template>
