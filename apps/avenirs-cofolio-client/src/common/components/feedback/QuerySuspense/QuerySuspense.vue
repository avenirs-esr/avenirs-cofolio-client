<script setup lang="ts">
import type { BaseApiException } from '@avenirs-esr/shared'
import type { Slot } from 'vue'
import { EmptyState, ErrorMessage, Loader } from '@avenirs-esr/shared'
import { useI18n } from 'vue-i18n'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'

export interface QuerySuspenseProps {
  error?: BaseApiException | null
  errorTitle?: string
  errorDescription?: string
  emptyStateMessage?: string
  isEmpty?: boolean
  isLoading?: boolean
  preserveContent?: boolean
}

const {
  errorTitle,
  errorDescription,
  emptyStateMessage,
  isEmpty,
  error = null,
  isLoading = false,
  preserveContent = false
} = defineProps<QuerySuspenseProps>()

defineSlots<{
  default?: Slot
  error?: Slot
  empty?: Slot
}>()

const { t } = useI18n()
const { getErrorMessage } = useApiErrors()
const computedErrorTitle = computed(() => errorTitle ?? t('global.components.QuerySuspense.defaultErrorTitle'))
const computedErrorDescription = computed(() => errorDescription ?? getErrorMessage(error))
const computedEmptyStateMessage = computed(() => emptyStateMessage ?? t('global.components.QuerySuspense.defaultEmptyStateMessage'))

const loaderProps = computed(() => preserveContent
  ? { 'data-testid': 'main-div' }
  : { isLoading })
</script>

<template>
  <div class="av-w-full">
    <Loader
      v-if="preserveContent && isLoading"
      :is-loading="isLoading"
      class="av-floating-right"
      size="4xl"
      data-testid="floating-loader"
    />
    <component
      :is="preserveContent ? 'div' : Loader"
      v-bind="loaderProps"
    >
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
    </component>
  </div>
</template>
