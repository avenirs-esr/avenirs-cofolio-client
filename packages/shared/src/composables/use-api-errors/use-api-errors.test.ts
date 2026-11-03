// @vitest-environment jsdom

import type { BaseApiException } from '#shared/exceptions'
import type { Ref } from 'vue'
import { useApiErrors } from '#shared/composables/use-api-errors/use-api-errors'
import { BaseApiErrorCode } from '#shared/exceptions'
import { mountComposable } from '#shared/test-utils/mount-composable'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { afterEach, beforeEach, expect } from 'vitest'
import { ref } from 'vue'

BddTest().given('a useApiErrors composable', () => {
  let errorRef: Ref<BaseApiException | null>
  let result: ReturnType<typeof useApiErrors>
  let unmount: () => void

  beforeEach(() => {
    errorRef = ref(null)
    const mounted = mountComposable(() => useApiErrors(errorRef), { usePinia: false, useI18n: true })
    result = mounted.result
    unmount = mounted.unmount
  })

  afterEach(() => unmount())

  BddTest().when('no error reference is provided', () => {
    beforeEach(() => {
      unmount()
      const mounted = mountComposable(() => useApiErrors(), { useI18n: true })
      result = mounted.result
      unmount = mounted.unmount
    })

    BddTest().then('it reports no error', () => {
      expect(result.isNotFound.value).toBe(false)
      expect(result.originalErrorCode.value).toBeUndefined()
      expect(result.isMatchingErrorCode(BaseApiErrorCode.NOT_FOUND)).toBe(false)
    })
  })

  BddTest().when('the HTTP status is 404 with a different error code', () => {
    beforeEach(() => {
      errorRef.value = {
        message: 'Not Found',
        name: 'Error',
        status: 404,
        code: BaseApiErrorCode.UNKNOWN,
      }
    })

    BddTest().then('it still identifies a not found error', () => {
      expect(result.isNotFound.value).toBe(true)
    })
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

  BddTest().when('getting an API error message', () => {
    BddTest().then('it should return the mapped i18n value when key exists', () => {
      const message = result.getErrorMessage({
        message: 'User not found',
        name: 'Error',
        status: 400,
        code: 'USER_NOT_FOUND' as BaseApiErrorCode,
      })

      expect(message).toBe('Utilisateur introuvable')
    })

    BddTest().then('it should return the generic message when key does not exist', () => {
      const message = result.getErrorMessage({
        message: 'Unknown',
        name: 'Error',
        status: 500,
        code: 'SOME_UNKNOWN_ERROR_CODE' as BaseApiErrorCode,
      })

      expect(message).toBe('Une erreur est survenue. Veuillez réessayer ultérieurement.')
    })

    BddTest().then('it should return the generic message when error is null', () => {
      const message = result.getErrorMessage(null)

      expect(message).toBe('Une erreur est survenue. Veuillez réessayer ultérieurement.')
    })
  })
})
