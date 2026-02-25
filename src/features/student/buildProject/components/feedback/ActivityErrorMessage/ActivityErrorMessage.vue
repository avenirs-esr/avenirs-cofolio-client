<script setup lang="ts">
import type { BaseApiException } from '@/common/exceptions'
import ErrorMessage from '@/common/components/feedback/ErrorMessage/ErrorMessage.vue'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { ErrorCodes } from '@/common/constants'
import { useI18n } from 'vue-i18n'

export interface ActivityErrorMessageProps {
  error: BaseApiException | null
}

const props = defineProps<ActivityErrorMessageProps>()
const { error } = toRefs(props)
const { t } = useI18n()
const { isMatchingErrorCode, isNotFound } = useApiErrors(error)

const title = computed(() => {
  if (isMatchingErrorCode(ErrorCodes.ACTIVITY_NOT_FOUND) || isNotFound.value) {
    return t('student.buildProject.activities.errors.notFound.title')
  }

  return t('global.error.generic')
})

const description = computed(() => {
  if (isMatchingErrorCode(ErrorCodes.ACTIVITY_NOT_FOUND)) {
    return t('student.buildProject.activities.errors.notFound.description')
  }

  return error.value?.message ?? ''
})
</script>

<template>
  <ErrorMessage
    v-if="error"
    :title
    :description
  />
</template>
