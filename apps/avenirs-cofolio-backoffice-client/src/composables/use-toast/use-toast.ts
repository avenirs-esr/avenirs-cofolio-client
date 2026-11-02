import type { BaseApiException } from '@avenirs-esr/shared'
import type { Ref } from 'vue'
import { useApiErrors } from '@avenirs-esr/shared'
import { useToasterStore } from '@/store'

export function useBaseApiExceptionToast (errorRef: Ref<BaseApiException | BaseApiException> | Ref<null | null>) {
  const { getErrorMessage } = useApiErrors()
  const { addErrorMessage } = useToasterStore()

  watch(errorRef, (error) => {
    if (error) {
      addErrorMessage(getErrorMessage(error))
    }
  }, { immediate: true })
}
