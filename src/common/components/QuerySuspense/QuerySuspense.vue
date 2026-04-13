<script setup lang="ts">
import type { BaseApiException } from '@/common/exceptions'
import type { Slot } from 'vue'
import EmptyState from '@/common/components/feedback/EmptyState/EmptyState.vue'
import ErrorMessage from '@/common/components/feedback/ErrorMessage/ErrorMessage.vue'
import Loader from '@/common/components/Loader/Loader.vue'
import { useI18n } from 'vue-i18n'

export interface QuerySuspenseProps {
  error?: BaseApiException | null
  errorTitle?: string
  emptyStateMessage?: string
  isEmpty?: boolean
  isLoading?: boolean
}

const {
  errorTitle,
  emptyStateMessage,
  isEmpty,
  error = null,
  isLoading = false
} = defineProps<QuerySuspenseProps>()

defineSlots<{
  default?: Slot
  error?: Slot
  empty?: Slot
}>()

const { t } = useI18n()
const computedErrorTitle = computed(() => errorTitle ?? t('global.components.QuerySuspense.defaultErrorTitle'))
const computedEmptyStateMessage = computed(() => emptyStateMessage ?? t('global.components.QuerySuspense.defaultEmptyStateMessage'))
</script>

<template>
  <Loader :is-loading>
    <div
      v-if="error"
      class="av-row av-px-2xl av-py-md av-justify-center"
    >
      <slot name="error">
        <ErrorMessage
          :title="computedErrorTitle"
          :description="error.message"
        />
      </slot>
    </div>
    <slot
      v-else-if="isEmpty"
      name="empty"
    >
      <EmptyState :title="computedEmptyStateMessage" />
    </slot>
    <slot v-else />
  </Loader>
</template>
