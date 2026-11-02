import type { BaseApiException } from '@avenirs-esr/shared'
import type { Ref } from 'vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { BaseApiErrorCode } from '@avenirs-esr/shared'
import { beforeEach, expect, vi } from 'vitest'
import { useBaseApiExceptionToast } from '@/composables/use-toast/use-toast'
import { mountComposable } from '@/tests/utils'

const mockAddErrorMessage = vi.fn()

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addErrorMessage: mockAddErrorMessage
    })
  }
})

BddTest().given('a useBaseApiExceptionToast composable', () => {
  let errorRef: Ref<BaseApiException, BaseApiException>

  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
  })

  BddTest().when('no message is provided', () => {
    beforeEach(() => {
      errorRef = ref({
        message: '',
        name: 'Error',
        status: 500,
        code: BaseApiErrorCode.UNKNOWN,
      })

      mountComposable(() => useBaseApiExceptionToast(errorRef), { useI18n: true, usePinia: true })
    })

    BddTest().then('it should add translated generic message', () => {
      expect(mockAddErrorMessage).toHaveBeenCalledWith('Une erreur est survenue. Veuillez réessayer ultérieurement.')
    })
  })

  BddTest().when('an error message is provided', () => {
    beforeEach(() => {
      errorRef = ref({
        message: 'Error',
        name: 'Error',
        status: 400,
        code: BaseApiErrorCode.BAD_REQUEST,
      })

      mountComposable(() => useBaseApiExceptionToast(errorRef), { useI18n: true, usePinia: true })
    })

    BddTest().then('it should add the error message', () => {
      expect(mockAddErrorMessage).toHaveBeenCalledWith('Requête invalide')
    })
  })

  BddTest().when('error is null', () => {
    beforeEach(() => {
      const nullErrorRef = ref(null)

      mountComposable(() => useBaseApiExceptionToast(nullErrorRef), { useI18n: true, usePinia: true })
    })

    BddTest().then('it should not call addErrorMessage', () => {
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
    })
  })
})
