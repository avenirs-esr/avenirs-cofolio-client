import type { Ref } from 'vue'
import { BaseApiErrorCode, type BaseApiException } from '@/common/exceptions'
import { mockAddErrorMessage } from 'tests/mocks'
import { mountComposable } from 'tests/utils'
import { vi } from 'vitest'
import { useBaseApiExceptionToast } from './use-toast'

describe('useBaseApiExceptionToast', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
  })

  it('should add translated generic message if no message is provided', () => {
    const errorRef = ref({
      message: '',
      name: 'Error',
      status: 500,
      code: BaseApiErrorCode.UNKNOWN,
    }) as Ref<BaseApiException, BaseApiException>

    mountComposable(() => useBaseApiExceptionToast(errorRef), { useI18n: true })
    expect(mockAddErrorMessage).toHaveBeenCalledWith('Une erreur est survenue. Veuillez réessayer ultérieurement.')
  })

  it('should add the error message if provided', () => {
    const errorRef = ref({
      message: 'Error',
      name: 'Error',
      status: 400,
      code: BaseApiErrorCode.BAD_REQUEST,
    }) as Ref<BaseApiException, BaseApiException>

    mountComposable(() => useBaseApiExceptionToast(errorRef), { useI18n: true })
    expect(mockAddErrorMessage).toHaveBeenCalledWith(errorRef.value.message)
  })

  it('should not call addErrorMessage if error is null', () => {
    const errorRef = ref(null)

    mountComposable(() => useBaseApiExceptionToast(errorRef), { useI18n: true })
    expect(mockAddErrorMessage).not.toHaveBeenCalled()
  })
})
