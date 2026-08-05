<script setup lang="ts">
import type { BaseApiException } from '@/common/exceptions'
import type { Slot } from 'vue'
import Card from '@/common/components/cards/Card/Card.vue'
import QuerySuspense from '@/common/components/QuerySuspense/QuerySuspense.vue'
import { AvButton, type AvButtonProps, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'

export interface ValorizedElementsCardContainerProps {
  title: string
  error?: BaseApiException | null
  isLoading?: boolean
  isEmpty?: boolean
  emptyStateMessage?: string
  seeAllLabel?: string
  seeAllTo?: AvButtonProps['to']
}

const {
  title,
  error = null,
  isLoading = false,
  isEmpty = false,
  emptyStateMessage,
  seeAllLabel,
  seeAllTo
} = defineProps<ValorizedElementsCardContainerProps>()

defineSlots<{
  default?: Slot
}>()
</script>

<template>
  <Card
    class="valorized-elements-card-container"
    collapsible
    border-color="var(--stroke)"
    background-color="var(--card)"
    title-background="var(--card)"
  >
    <template #title>
      <div class="av-row av-align-center av-justify-between av-gap-sm av-w-full">
        <span class="s1-regular">
          {{ title }}
        </span>
        <AvButton
          v-if="seeAllLabel && seeAllTo"
          :label="seeAllLabel"
          :icon="MDI_ICONS.ARROW_RIGHT_THIN"
          small
          :to="seeAllTo"
          data-testid="see-all-button"
        />
      </div>
    </template>
    <QuerySuspense
      :error="error"
      :is-loading="isLoading"
      :is-empty="isEmpty"
      :empty-state-message="emptyStateMessage"
    >
      <slot />
    </QuerySuspense>
  </Card>
</template>
