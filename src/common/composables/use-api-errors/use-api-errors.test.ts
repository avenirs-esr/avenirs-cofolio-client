import type { Ref } from 'vue'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { BaseApiErrorCode, type BaseApiException } from '@/common/exceptions'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a useApiErrors composable', () => {
  let errorRef: Ref<BaseApiException | null>
  let result: ReturnType<typeof useApiErrors>

  beforeEach(() => {
    errorRef = ref(null)
    const { result: res } = mountComposable(() => useApiErrors(errorRef), { usePinia: false, useI18n: false })
    result = res
  })

  BddTest().when('error is null', () => {
    BddTest().then('isNotFound should return false', () => {
      expect(result.isNotFound.value).toBe(false)
    })

    BddTest().then('originalErrorCode should be undefined', () => {
      expect(result.originalErrorCode.value).toBeUndefined()
    })

    BddTest().then('isMatchingErrorCode should return false for any code', () => {
      expect(result.isMatchingErrorCode(BaseApiErrorCode.NOT_FOUND)).toBe(false)
    })
  })

  BddTest().when('error code is NOT_FOUND', () => {
    beforeEach(() => {
      errorRef.value = {
        message: 'Not Found',
        name: 'Error',
        status: 400,
        code: BaseApiErrorCode.NOT_FOUND,
      }
    })

    BddTest().then('isNotFound should return true', () => {
      expect(result.isNotFound.value).toBe(true)
    })

    BddTest().then('originalErrorCode should return NOT_FOUND', () => {
      expect(result.originalErrorCode.value).toBe(BaseApiErrorCode.NOT_FOUND)
    })

    BddTest().then('isMatchingErrorCode should return true for NOT_FOUND', () => {
      expect(result.isMatchingErrorCode(BaseApiErrorCode.NOT_FOUND)).toBe(true)
    })

    BddTest().then('isMatchingErrorCode should return false for other codes', () => {
      expect(result.isMatchingErrorCode(BaseApiErrorCode.FORBIDDEN)).toBe(false)
    })
  })

  BddTest().when('error code is not NOT_FOUND', () => {
    beforeEach(() => {
      errorRef.value = {
        message: 'Forbidden',
        name: 'Error',
        status: 403,
        code: BaseApiErrorCode.FORBIDDEN,
      }
    })

    BddTest().then('isNotFound should return false', () => {
      expect(result.isNotFound.value).toBe(false)
    })

    BddTest().then('originalErrorCode should return FORBIDDEN', () => {
      expect(result.originalErrorCode.value).toBe(BaseApiErrorCode.FORBIDDEN)
    })

    BddTest().then('isMatchingErrorCode should return true for FORBIDDEN', () => {
      expect(result.isMatchingErrorCode(BaseApiErrorCode.FORBIDDEN)).toBe(true)
    })
  })

  BddTest().when('the errorRef value changes over time', () => {
    BddTest().then('isNotFound should reactively update', async () => {
      expect(result.isNotFound.value).toBe(false)

      errorRef.value = {
        message: 'Not Found',
        name: 'Error',
        status: 400,
        code: BaseApiErrorCode.NOT_FOUND,
      }
      await Promise.resolve()
      expect(result.isNotFound.value).toBe(true)

      errorRef.value = null
      await Promise.resolve()
      expect(result.isNotFound.value).toBe(false)
    })

    BddTest().then('originalErrorCode should reactively update', async () => {
      expect(result.originalErrorCode.value).toBeUndefined()

      errorRef.value = {
        message: 'Forbidden',
        name: 'Error',
        status: 403,
        code: BaseApiErrorCode.FORBIDDEN,
      }
      await Promise.resolve()
      expect(result.originalErrorCode.value).toBe(BaseApiErrorCode.FORBIDDEN)

      errorRef.value = null
      await Promise.resolve()
      expect(result.originalErrorCode.value).toBeUndefined()
    })
  })
})
