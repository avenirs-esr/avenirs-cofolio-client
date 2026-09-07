<script setup lang="ts">
import type { BaseApiException } from '@/common/exceptions'
import type { Slot } from 'vue'
import IconTitleCardContainer from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.vue'
import QuerySuspense from '@/common/components/QuerySuspense/QuerySuspense.vue'
import { RI_ICONS } from '@avenirs-esr/avenirs-dsav'

export interface DashboardSectionProps {
  title: string
  titleIcon?: string
  isLoading?: boolean
  error?: BaseApiException | null
}

const {
  titleIcon = RI_ICONS.DASHBOARD_2_LINE,
  isLoading = false,
  error = null
} = defineProps<DashboardSectionProps>()

defineSlots<{
  default?: Slot
}>()
</script>

<template>
  <IconTitleCardContainer
    :title="title"
    :title-icon="titleIcon"
    data-testid="dashboard-section"
  >
    <QuerySuspense
      :is-loading="isLoading"
      :error="error"
    >
      <div class="av-row av-wrap av-w-full av-gap-sm">
        <slot />
      </div>
    </QuerySuspense>
  </IconTitleCardContainer>
</template>
