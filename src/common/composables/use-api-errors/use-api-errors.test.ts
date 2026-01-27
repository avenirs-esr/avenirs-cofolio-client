import type { Ref } from 'vue'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { BaseApiErrorCode, type BaseApiException } from '@/common/exceptions'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a useApiErrors composable', () => {
  let errorRef: Ref<BaseApiException | null>

  beforeEach(() => {
    errorRef = ref(null)
  })

  BddTest().when('error is null', () => {
    let isNotFound: Ref<boolean>

    beforeEach(() => {
      const result = mountComposable(() => useApiErrors(errorRef), { usePinia: false, useI18n: false })
      isNotFound = result.result.isNotFound as unknown as Ref<boolean>
    })

    BddTest().then('it should return false', () => {
      expect(isNotFound.value).toBe(false)
    })
  })

  BddTest().when('error status is 404', () => {
    let isNotFound: Ref<boolean>

    beforeEach(() => {
      errorRef.value = {
        message: 'Not Found',
        name: 'Error',
        status: 404,
        code: BaseApiErrorCode.UNKNOWN,
      }

      const result = mountComposable(() => useApiErrors(errorRef), { usePinia: false, useI18n: false })
      isNotFound = result.result.isNotFound as unknown as Ref<boolean>
    })

    BddTest().then('it should return true', () => {
      expect(isNotFound.value).toBe(true)
    })
  })

  BddTest().when('error code matches the provided code', () => {
    let isNotFound: Ref<boolean>

    beforeEach(() => {
      errorRef.value = {
        message: 'Skill not found',
        name: 'Error',
        status: 400,
        code: BaseApiErrorCode.NOT_FOUND,
      }

      const result = mountComposable(
        () => useApiErrors(errorRef, BaseApiErrorCode.NOT_FOUND),
        { usePinia: false, useI18n: false }
      )
      isNotFound = result.result.isNotFound as unknown as Ref<boolean>
    })

    BddTest().then('it should return true', () => {
      expect(isNotFound.value).toBe(true)
    })
  })

  BddTest().when('error exists but neither status is 404 nor code matches', () => {
    let isNotFound: Ref<boolean>

    beforeEach(() => {
      errorRef.value = {
        message: 'Forbidden',
        name: 'Error',
        status: 403,
        code: BaseApiErrorCode.FORBIDDEN,
      }

      const result = mountComposable(
        () => useApiErrors(errorRef, BaseApiErrorCode.NOT_FOUND),
        { usePinia: false, useI18n: false }
      )
      isNotFound = result.result.isNotFound as unknown as Ref<boolean>
    })

    BddTest().then('it should return false', () => {
      expect(isNotFound.value).toBe(false)
    })
  })

  BddTest().when('the errorRef value changes over time', () => {
    let isNotFound: Ref<boolean>

    beforeEach(() => {
      const result = mountComposable(
        () => useApiErrors(errorRef, BaseApiErrorCode.NOT_FOUND),
        { usePinia: false, useI18n: false }
      )
      isNotFound = result.result.isNotFound as unknown as Ref<boolean>
    })

    BddTest().then('it should reactively update', async () => {
      expect(isNotFound.value).toBe(false)

      errorRef.value = {
        message: 'Not Found',
        name: 'Error',
        status: 404,
        code: BaseApiErrorCode.UNKNOWN,
      }
      await Promise.resolve()
      expect(isNotFound.value).toBe(true)

      errorRef.value = null
      await Promise.resolve()
      expect(isNotFound.value).toBe(false)
    })
  })
})
