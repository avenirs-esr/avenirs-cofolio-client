<script setup lang="ts">
import type { BaseApiException } from '@/common/exceptions'
import Card from '@/common/components/cards/Card/Card.vue'
import QuerySuspense from '@/common/components/QuerySuspense/QuerySuspense.vue'

export interface ValorizedElementsCardContainerProps {
  title: string
  error?: BaseApiException | null
  isLoading?: boolean
}

const { title, error = null, isLoading = false } = defineProps<ValorizedElementsCardContainerProps>()
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
      <span class="s1-regular">
        {{ title }}
      </span>
    </template>
    <QuerySuspense
      :error="error"
      :is-loading="isLoading"
    >
      <slot />
    </QuerySuspense>
  </Card>
</template>
