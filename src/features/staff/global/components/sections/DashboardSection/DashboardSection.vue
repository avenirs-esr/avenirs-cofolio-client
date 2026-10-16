<script setup lang="ts">
import type { Slot } from 'vue'
import type { BaseApiException } from '@/common/exceptions'
import { RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import IconTitleCardContainer from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.vue'
import QuerySuspense from '@/common/components/feedback/QuerySuspense/QuerySuspense.vue'

export interface DashboardSectionProps {
  title: string
  titleIcon?: string
  isLoading?: boolean
  isEmpty?: boolean
  emptyStateMessage?: string
  error?: BaseApiException | null
}

const {
  titleIcon = RI_ICONS.DASHBOARD_2_LINE,
  isLoading = false,
  isEmpty = false,
  emptyStateMessage,
  error = null
} = defineProps<DashboardSectionProps>()

const slots = defineSlots<{
  default?: Slot
  details?: Slot
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
      :is-empty="isEmpty"
      :empty-state-message="emptyStateMessage"
      :error="error"
    >
      <div class="av-col av-w-full av-gap-md">
        <div class="av-row av-wrap av-w-full av-gap-sm">
          <slot />
        </div>
        <slot
          v-if="slots.details"
          name="details"
        />
      </div>
    </QuerySuspense>
  </IconTitleCardContainer>
</template>
