import type { BaseApiException } from '#shared/exceptions'
import type { Ref } from 'vue'
import { useApiErrors } from '#shared/composables/use-api-errors/use-api-errors'
import { useToasterStore } from '#shared/stores/toaster/toaster'
import { watch } from 'vue'

export function useBaseApiExceptionToast (errorRef: Ref<BaseApiException | null>) {
  const { getErrorMessage } = useApiErrors()
  const { addErrorMessage } = useToasterStore()

  watch(errorRef, (error) => {
    if (error) {
      addErrorMessage(getErrorMessage(error))
    }
  }, { immediate: true })
}
