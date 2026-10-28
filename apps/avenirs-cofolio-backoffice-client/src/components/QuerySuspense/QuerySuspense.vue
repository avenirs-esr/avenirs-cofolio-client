<script setup lang="ts">
import type { Slot } from 'vue'
import type { BaseApiException } from '@/exceptions'
import { EmptyState, ErrorMessage, Loader } from '@avenirs-esr/shared'
import { useI18n } from 'vue-i18n'
import { useApiErrors } from '@/composables/use-api-errors/use-api-errors'

export interface QuerySuspenseProps {
  error?: BaseApiException | null
  errorTitle?: string
  errorDescription?: string
  emptyStateMessage?: string
  isEmpty?: boolean
  isLoading?: boolean
}

const {
  errorTitle,
  errorDescription,
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
const { getErrorMessage } = useApiErrors()
const computedErrorTitle = computed(() => errorTitle ?? t('global.QuerySuspense.defaultErrorTitle'))
const computedErrorDescription = computed(() => errorDescription ?? getErrorMessage(error))
const computedEmptyStateMessage = computed(() => emptyStateMessage ?? t('global.QuerySuspense.defaultEmptyStateMessage'))
</script>

<template>
  <div class="av-w-full">
    <Loader :is-loading>
      <div
        v-if="error"
        class="av-row av-px-2xl av-py-md av-justify-center"
      >
        <slot name="error">
          <ErrorMessage
            :title="computedErrorTitle"
            :description="computedErrorDescription"
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
  </div>
</template>
