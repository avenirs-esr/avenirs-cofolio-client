import type { BaseApiException } from '@/common/exceptions'
import type { Ref } from 'vue'
import { useToasterStore } from '@/store'
import { useI18n } from 'vue-i18n'

export function useBaseApiExceptionToast (errorRef: Ref<BaseApiException | BaseApiException> | Ref<null | null>) {
  const { t } = useI18n()
  const { addErrorMessage } = useToasterStore()

  watch(errorRef, (error) => {
    if (error) {
      addErrorMessage(error.message || t('global.error.generic'))
    }
  })
}
