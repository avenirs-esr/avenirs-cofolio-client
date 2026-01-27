import type { ErrorCode } from '@/common/constants'
import type { BaseApiException } from '@/common/exceptions'
import type { Ref } from 'vue'

export function useApiErrors (errorRef: Ref<BaseApiException | BaseApiException> | Ref<null | null>, code?: ErrorCode) {
  const isNotFound = computed(() => {
    const error = errorRef.value
    if (!error) {
      return false
    }
    return error.code === code || error.status === 404
  })

  return {
    isNotFound
  }
}
