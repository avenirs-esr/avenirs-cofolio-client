import type { BaseApiException } from '@/common/exceptions'
import type { Ref } from 'vue'
import { type ErrorCode, ErrorCodes } from '@/common/constants'

export function useApiErrors (errorRef: Ref<BaseApiException> | Ref<null>) {
  const isNotFound = computed(() => {
    const error = errorRef.value
    if (!error) {
      return false
    }
    return error.code === ErrorCodes.NOT_FOUND || errorRef.value.status === 404
  })

  const originalErrorCode = computed(() => errorRef.value?.code)

  function isMatchingErrorCode (code: ErrorCode) {
    const error = errorRef.value
    if (!error) {
      return false
    }
    return error.code === code
  }

  return {
    originalErrorCode,
    isNotFound,
    isMatchingErrorCode,
  }
}
